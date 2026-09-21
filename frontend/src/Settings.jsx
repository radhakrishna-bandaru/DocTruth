import { useEffect, useState } from "react";
import "./Settings.css";

function Settings() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  const [notifications, setNotifications] = useState(
    localStorage.getItem("notificationsEnabled") !== "false"
  );

  const [autoVerification, setAutoVerification] = useState(
    localStorage.getItem("autoVerification") !== "false"
  );

  const go = (path) => {
    window.location.href = path;
  };

  // Apply dark mode immediately
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  const handleDarkMode = () => {
    const value = !darkMode;

    setDarkMode(value);

    localStorage.setItem(
      "darkMode",
      value.toString()
    );

    if (value) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  };

  const handleNotifications = () => {
    const value = !notifications;

    setNotifications(value);

    localStorage.setItem(
      "notificationsEnabled",
      value.toString()
    );
  };

  const handleAutoVerification = () => {
    const value = !autoVerification;

    setAutoVerification(value);

    localStorage.setItem(
      "autoVerification",
      value.toString()
    );
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");

    window.location.href = "/";
  };

  return (
    <div className="dashboard-shell settings-shell">

      {/* SIDEBAR */}

      <aside className="creative-sidebar">

        <div className="brand-area">

         <div className="brand-mark">
  <img
    src="/DocTruth.png"
    alt="DocTruth"
  />
</div>

          <div>
            <h2>DocTruth</h2>

            <span>
              AI Document Intelligence
            </span>
          </div>

        </div>

        <nav className="creative-nav">

          <button
            className="creative-nav-item"
            onClick={() => go("/dashboard")}
          >
            <b>⌂</b>
            <span>Dashboard</span>
          </button>

          <button
            className="creative-nav-item"
            onClick={() => go("/upload")}
          >
            <b>↥</b>
            <span>Upload</span>
          </button>

          <button
            className="creative-nav-item"
            onClick={() => go("/documents")}
          >
            <b>▣</b>
            <span>Documents</span>
          </button>

          <button
            className="creative-nav-item"
            onClick={() => go("/analytics")}
          >
            <b>▥</b>
            <span>Analytics</span>
          </button>

          <button
            className="creative-nav-item"
            onClick={() => go("/notifications")}
          >
            <b>♧</b>
            <span>Notifications</span>
          </button>

          <button
            className="creative-nav-item"
            onClick={() => go("/profile")}
          >
            <b>♙</b>
            <span>Profile</span>
          </button>

          <button className="creative-nav-item active">
            <b>⚙</b>
            <span>Settings</span>
          </button>

        </nav>

        {/* USER */}

        <div className="sidebar-user">

          <div className="avatar">
            {user?.email
              ?.charAt(0)
              .toUpperCase() || "U"}
          </div>

          <div>
            <strong>
              {user?.email || "User"}
            </strong>
          </div>

        </div>

        {/* LOGOUT */}

        <button
          className="creative-logout"
          onClick={logout}
        >
          ⇥ Logout
        </button>

      </aside>

      {/* MAIN */}

      <main className="creative-main settings-main-new">

        {/* TOPBAR */}

        <div className="topbar">

          <div className="search-box">
            🔍

            <input
              placeholder="Search settings..."
            />
          </div>

          <div className="top-actions">

            <button
              onClick={handleDarkMode}
              title={
                darkMode
                  ? "Light Mode"
                  : "Dark Mode"
              }
            >
              {darkMode ? "☀" : "◐"}
            </button>

            <button
              onClick={() => go("/upload")}
            >
              ↥
            </button>

            <button
              onClick={() =>
                go("/notifications")
              }
            >
              ♧
            </button>

            <div
              className="top-user"
              onClick={() =>
                go("/profile")
              }
            >

              <div className="avatar small">

                {user?.email
                  ?.charAt(0)
                  .toUpperCase() || "U"}

              </div>

              <span>
                {user?.email || "User"}
              </span>

            </div>

          </div>

        </div>

        {/* HEADER */}

        <section className="welcome-section">

          <div>

            <p className="eyebrow">
              APPLICATION SETTINGS
            </p>

            <h1>
              Settings ⚙
            </h1>

            <p>
              Customize your DocTruth
              experience.
            </p>

          </div>

        </section>

        {/* SETTINGS CARD */}

        <section className="creative-card settings-new-card">

          {/* APPLICATION */}

          <div className="settings-section">

            <div className="section-title">

              <h2>
                Application Preferences
              </h2>

              <p>
                Control how DocTruth behaves.
              </p>

            </div>

            {/* DARK MODE */}

            <div className="setting-row">

              <div className="setting-info">

                <div className="setting-icon">
                  ◐
                </div>

                <div>

                  <h3>
                    Dark Mode
                  </h3>

                  <p>
                    Use a darker appearance
                    for the application.
                  </p>

                </div>

              </div>

              <button
                className={`toggle ${
                  darkMode ? "on" : ""
                }`}
                onClick={handleDarkMode}
              >
                <span></span>
              </button>

            </div>

            {/* NOTIFICATIONS */}

            <div className="setting-row">

              <div className="setting-info">

                <div className="setting-icon">
                  🔔
                </div>

                <div>

                  <h3>
                    Notifications
                  </h3>

                  <p>
                    Receive document
                    verification notifications.
                  </p>

                </div>

              </div>

              <button
                className={`toggle ${
                  notifications ? "on" : ""
                }`}
                onClick={handleNotifications}
              >
                <span></span>
              </button>

            </div>

            {/* AUTO VERIFICATION */}

            <div className="setting-row">

              <div className="setting-info">

                <div className="setting-icon">
                  ✓
                </div>

                <div>

                  <h3>
                    Automatic Verification
                  </h3>

                  <p>
                    Automatically process
                    documents after upload.
                  </p>

                </div>

              </div>

              <button
                className={`toggle ${
                  autoVerification ? "on" : ""
                }`}
                onClick={
                  handleAutoVerification
                }
              >
                <span></span>
              </button>

            </div>

          </div>

          {/* ACCOUNT */}

          <div className="settings-section account-section">

            <div className="section-title">

              <h2>
                Account
              </h2>

              <p>
                Your current account
                information.
              </p>

            </div>

            <div className="account-box">

              <div>

                <span>
                  Email
                </span>

                <strong>
                  {user?.email ||
                    "Not available"}
                </strong>

              </div>

              <button
                onClick={() =>
                  go("/profile")
                }
              >
                View Profile
              </button>

            </div>

          </div>

          {/* SIGN OUT */}

          <div className="danger-section">

            <div>

              <h2>
                Sign Out
              </h2>

              <p>
                Sign out from your
                DocTruth account on this
                device.
              </p>

            </div>

            <button onClick={logout}>
              Sign Out
            </button>

          </div>

        </section>

      </main>

      {/* RIGHT PANEL */}

      <aside className="right-insight">

        <div className="insight-orb">
          ◇
        </div>

        <h3>
          Smart
          <br />
          Settings
        </h3>

        <p>
          Configure your verification
          workspace and preferences.
        </p>

        <div className="insight-line"></div>

        <strong>
          {autoVerification ? "ON" : "OFF"}
        </strong>

        <span>
          Auto Verification
        </span>

        <strong>
          {notifications ? "ON" : "OFF"}
        </strong>

        <span>
          Notifications
        </span>

        <div className="robot">
          ⚙️
        </div>

      </aside>

    </div>
  );
}

export default Settings;