import React, { useState } from "react";
import { createUser } from "./api";
import { saveCurrentUser } from "./auth";
import "./Auth.css";

const MIN_PASSWORD_LENGTH = 8;

function Signup() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    passwordAgain: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
    setError("");
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!form.fullName || !form.email || !form.password || !form.passwordAgain) {
      setError("Fill in all the fields");
      return;
    }
    if (form.password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
      return;
    }
    if (form.password !== form.passwordAgain) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);
    createUser({ fullName: form.fullName, email: form.email, password: form.password })
      .then((user) => {
        // log them in right away after signing up
        saveCurrentUser(user);
        window.location.href = "/";
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <label htmlFor="fullName">Full Name:</label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          placeholder="Your Name"
          value={form.fullName}
          onChange={handleChange}
        />

        <label htmlFor="email">Cal Poly Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="yourname@calpoly.edu"
          value={form.email}
          onChange={handleChange}
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Example"
          value={form.password}
          onChange={handleChange}
        />

        <label htmlFor="passwordAgain">Password Again:</label>
        <input
          type="password"
          id="passwordAgain"
          name="passwordAgain"
          placeholder="Example"
          value={form.passwordAgain}
          onChange={handleChange}
        />

        {error && <p className="auth-error">{error}</p>}

        <button type="submit" className="auth-btn auth-btn-blue" disabled={loading}>
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}

export default Signup;
