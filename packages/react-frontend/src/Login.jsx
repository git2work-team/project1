import React, { useState } from "react";
import { loginUser } from "./api";
import { saveCurrentUser } from "./auth";
import "./Auth.css";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
    setError("");
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!form.email || !form.password) {
      setError("Enter your email and password");
      return;
    }

    setLoading(true);
    loginUser(form.email, form.password)
      .then((user) => {
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
        <h1>SLO Foods</h1>

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

        <p className="auth-forgot">
          Forgot Password?{" "}
          <button
            type="button"
            className="auth-reset"
            onClick={() => setError("Password reset isn't set up yet")}
          >
            Reset
          </button>
        </p>

        {error && <p className="auth-error">{error}</p>}

        <button type="submit" className="auth-btn auth-btn-orange" disabled={loading}>
          {loading ? "Logging in..." : "Log In"}
        </button>

        <p className="auth-or">Or</p>

        <a className="auth-btn auth-btn-gray" href="/Signup">
          Sign Up
        </a>
      </form>
    </div>
  );
}

export default Login;
