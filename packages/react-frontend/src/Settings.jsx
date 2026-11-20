import React, { useState, useEffect, useMemo } from "react";
import { getCurrentUser, updateCurrentUser } from "./auth";
import { getUserById, updateUser } from "./api";
import "./Settings.css";

const MAX_BIO_LENGTH = 500;
// same limits as the backend (tables/user.js)
const MAX_LIST_ITEMS = 20;
const MAX_ITEM_LENGTH = 50;

// "peanuts, shellfish" -> ["peanuts", "shellfish"] (trimmed, blanks dropped)
function textToList(text) {
  return text
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item !== "");
}

// Returns an error message if the list is too long, or "" if it is fine
function checkList(list, label) {
  if (list.length > MAX_LIST_ITEMS) {
    return `${label}: add at most ${MAX_LIST_ITEMS} items`;
  }
  if (list.some((item) => item.length > MAX_ITEM_LENGTH)) {
    return `${label}: each item can be at most ${MAX_ITEM_LENGTH} characters`;
  }
  return "";
}

// Turns what the backend sent into the text shown in the form
function userToForm(saved) {
  return {
    fullName: saved.fullName || "",
    bio: saved.bio || "",
    allergies: (saved.allergies || []).join(", "),
    dislikedFoods: (saved.dislikedFoods || []).join(", "),
  };
}

// Account settings page. Loads the saved profile and saves changes to the backend.
// The photo picker only shows a preview for now, uploading it is added later.
function Settings() {
  const user = getCurrentUser();
  const [form, setForm] = useState({ fullName: "", bio: "", allergies: "", dislikedFoods: "" });
  const [photo, setPhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(user));
  const [loadError, setLoadError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  // { type: "success" | "error", text } shown above the Save button
  const [message, setMessage] = useState(null);

  // Show the picked photo in the circle before anything is uploaded
  const previewUrl = useMemo(() => (photo ? URL.createObjectURL(photo) : ""), [photo]);
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Only logged in people can see this page. Sending everyone else to log in is
  // only for convenience, the backend still checks the token on every request.
  useEffect(() => {
    if (!user) {
      window.location.href = "/Login";
    }
  }, []);

  // Fill the form with what is saved on the server
  useEffect(() => {
    if (!user) {
      return undefined;
    }
    let isCancelled = false;
    getUserById(user._id)
      .then((saved) => {
        if (!isCancelled) {
          setForm(userToForm(saved));
          setIsLoading(false);
        }
      })
      .catch((error) => {
        if (!isCancelled) {
          setLoadError(error.message);
          setIsLoading(false);
        }
      });
    return () => {
      isCancelled = true;
    };
  }, []);

  if (!user) {
    return null;
  }

  // If loading failed there is nothing to edit. Showing an empty form could let someone
  // save blanks over their real bio and allergies, so the form is not shown at all.
  if (loadError) {
    return (
      <div className="settings-page">
        <h1>Settings</h1>
        <p className="settings-message settings-message-error" role="alert">
          Could not load your settings: {loadError}
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="settings-page">
        <h1>Settings</h1>
        <p className="settings-hint">Loading your settings...</p>
      </div>
    );
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
    setMessage(null);
  }

  function handleSubmit(event) {
    event.preventDefault();

    const fullName = form.fullName.trim();
    const allergies = textToList(form.allergies);
    const dislikedFoods = textToList(form.dislikedFoods);

    const problem =
      (fullName === "" && "Enter your name") ||
      checkList(allergies, "Allergies") ||
      checkList(dislikedFoods, "Foods I don't eat");
    if (problem) {
      setMessage({ type: "error", text: problem });
      return;
    }

    setIsSaving(true);
    setMessage(null);
    // email is not sent, so it can't be changed from this page
    updateUser(user._id, { fullName, bio: form.bio, allergies, dislikedFoods })
      .then((saved) => {
        setForm(userToForm(saved));
        updateCurrentUser({ fullName: saved.fullName });
        setMessage({ type: "success", text: "Saved" });
      })
      .catch((error) => setMessage({ type: "error", text: error.message }))
      .finally(() => setIsSaving(false));
  }

  return (
    <div className="settings-page">
      <form className="settings-card" onSubmit={handleSubmit}>
        <h1>Settings</h1>

        <div className="settings-photo-row">
          <div className="settings-avatar">
            {previewUrl ? (
              <img src={previewUrl} alt="Profile preview" />
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <circle cx="12" cy="6" r="4" />
                <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
              </svg>
            )}
          </div>
          <div>
            <label htmlFor="photo">Profile photo</label>
            <input
              id="photo"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) => setPhoto(event.target.files[0] || null)}
            />
            <p className="settings-hint">JPG, PNG or WebP</p>
          </div>
        </div>

        <label htmlFor="fullName">Name</label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          maxLength={100}
          value={form.fullName}
          onChange={handleChange}
        />

        <label htmlFor="bio">Bio</label>
        <textarea
          id="bio"
          name="bio"
          rows="4"
          maxLength={MAX_BIO_LENGTH}
          placeholder="Tell people a little about yourself"
          value={form.bio}
          onChange={handleChange}
        />
        <p className="settings-hint">
          {form.bio.length}/{MAX_BIO_LENGTH}
        </p>

        <label htmlFor="allergies">Allergies</label>
        <input
          type="text"
          id="allergies"
          name="allergies"
          placeholder="Separate with commas, e.g. peanuts, shellfish"
          value={form.allergies}
          onChange={handleChange}
        />

        <label htmlFor="dislikedFoods">Foods I don&apos;t eat</label>
        <input
          type="text"
          id="dislikedFoods"
          name="dislikedFoods"
          placeholder="Separate with commas, e.g. pork, mushrooms"
          value={form.dislikedFoods}
          onChange={handleChange}
        />

        {message && (
          <p
            className={`settings-message settings-message-${message.type}`}
            role={message.type === "error" ? "alert" : "status"}
          >
            {message.text}
          </p>
        )}

        <button type="submit" className="settings-save" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save changes"}
        </button>
      </form>
    </div>
  );
}

export default Settings;
