import React, { useState, useEffect, useMemo } from "react";
import { getCurrentUser } from "./auth";
import "./Settings.css";

const MAX_BIO_LENGTH = 500;

// Account settings page. For now the form only holds values in the page,
// saving to the backend is connected in a later step.
function Settings() {
  const user = getCurrentUser();
  const [form, setForm] = useState({
    fullName: user ? user.fullName : "",
    bio: "",
    allergies: "",
    dislikedFoods: "",
  });
  const [photo, setPhoto] = useState(null);

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

  if (!user) {
    return null;
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  }

  function handleSubmit(event) {
    event.preventDefault();
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

        <button type="submit" className="settings-save">
          Save changes
        </button>
      </form>
    </div>
  );
}

export default Settings;
