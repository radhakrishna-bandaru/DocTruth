import { useState } from "react";
import "./Register.css";

function Register() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
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

const handleRegister = async (e) => {
  e.preventDefault();

  setLoading(true);
  setMessage("Creating account...");

  try {
    // 1. Register
    const registerResponse = await fetch(
      "/api/auth/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      }
    );

    const registerData = await registerResponse.json();

    if (!registerResponse.ok) {
      setMessage(registerData.detail || "Registration failed");
      setLoading(false);
      return;
    }

    // 2. Automatically login using same email/password
    setMessage("Account created. Signing you in...");

    const loginResponse = await fetch(
      "/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      }
    );

    const loginData = await loginResponse.json();

    if (!loginResponse.ok) {
      setMessage(
        "Account created, but automatic login failed. Please login once."
      );
      setLoading(false);
      return;
    }

    // 3. Save login details
    localStorage.setItem(
      "access_token",
      loginData.access_token
    );

    localStorage.setItem(
      "user",
      JSON.stringify({
        ...loginData.user,
        full_name: form.full_name,
        phone: form.phone,
      })
    );

    // 4. Direct Dashboard
    window.location.href = "/dashboard";

  } catch (error) {
    console.error("Registration error:", error);
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

        {/* REGISTER CARD */}
        <div className="auth-card">

          <div className="auth-card-header">
            <span className="auth-eyebrow">
              GET STARTED
            </span>

            <h2>Create Account</h2>

            <p>
              Create your DocTruth account to continue.
            </p>
          </div>

          <form onSubmit={handleRegister}>

            <div className="auth-input-group">
              <label>Full Name</label>

              <input
                type="text"
                name="full_name"
                placeholder="Enter your full name"
                value={form.full_name}
                onChange={handleChange}
                required
              />
            </div>

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
              <label>Phone Number</label>

              <input
                type="tel"
                name="phone"
                placeholder="Enter your phone number"
                value={form.phone}
                onChange={handleChange}
              />
            </div>

            <div className="auth-input-group">
              <label>Password</label>

              <input
                type="password"
                name="password"
                placeholder="Create a password"
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
              {loading ? "Creating Account..." : "Create Account"}
            </button>

          </form>

          {message && (
            <div className="auth-message">
              {message}
            </div>
          )}

          <div className="auth-footer">
            <span>Already have an account?</span>

            <button
              type="button"
              onClick={() => {
                window.location.href = "/";
              }}
            >
              Login
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Register;