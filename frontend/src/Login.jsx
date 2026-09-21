import { useState } from "react";
import "./Login.css";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("Signing in...");

    try {
      const response = await fetch(
        "/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user));

        window.navigate("/dashboard");
      } else {
        setMessage(data.detail || "Invalid email or password");
      }
    } catch (error) {
      setMessage("Unable to connect to server");
    }

    setLoading(false);
  };

  return (
    <div className="auth-page">

      <div className="auth-background-shape shape-one"></div>
      <div className="auth-background-shape shape-two"></div>

      <div className="auth-container">

        {/* LEFT BRAND */}
        <div className="auth-brand-section">

          <div className="auth-logo">
            ➤
          </div>

          <h1>DocTruth</h1>

          <p className="auth-brand-subtitle">
            AI Document Intelligence
          </p>

          <p className="auth-brand-description">
            Verify, analyze and manage your documents
            with intelligent document verification.
          </p>

          <div className="auth-feature">
            <span>✓</span>
            <p>AI-powered document verification</p>
          </div>

          <div className="auth-feature">
            <span>✓</span>
            <p>Secure document management</p>
          </div>

          <div className="auth-feature">
            <span>✓</span>
            <p>Smart verification insights</p>
          </div>

        </div>

        {/* LOGIN CARD */}
        <div className="auth-card">

          <div className="auth-card-header">

            <span className="auth-eyebrow">
              WELCOME BACK
            </span>

            <h2>Sign In</h2>

            <p>
              Sign in to access your DocTruth workspace.
            </p>

          </div>

          <form onSubmit={handleLogin}>

            <div className="auth-input-group">

              <label>Email Address</label>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                required
              />

            </div>

            <div className="auth-input-group">

              <label>Password</label>

              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
              />

            </div>

            <button
              className="auth-submit-btn"
              type="submit"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Login"}
            </button>

          </form>

          {message && (
            <div className="auth-message">
              {message}
            </div>
          )}

          <div className="auth-footer">

            <span>Don't have an account?</span>

            <button
              type="button"
              onClick={() => {
                window.navigate("/register");
              }}
            >
              Create Account
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;