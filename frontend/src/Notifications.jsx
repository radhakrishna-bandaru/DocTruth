import { useEffect, useState } from "react";
import "./Notifications.css";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  const go = (path) => {
    window.navigate(path);
  };

  const logout = () => {
    localStorage.clear();
    window.navigate("/");
  };

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    fetch(
      `/api/notifications/${user.id}`
    )
      .then((response) => response.json())
      .then((data) => {
        setNotifications(
          data.notifications || []
        );
        setLoading(false);
      })
      .catch((error) => {
        console.error(
          "Error fetching notifications:",
          error
        );
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  const getIcon = (type) => {
    if (type === "success") return "✓";
    if (type === "warning") return "!";
    return "i";
  };

  return (
    <div className="dashboard-shell">

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
            onClick={() =>
              go("/dashboard")
            }
          >
            <b>⌂</b>
            <span>Dashboard</span>
          </button>

          <button
            className="creative-nav-item"
            onClick={() =>
              go("/upload")
            }
          >
            <b>↥</b>
            <span>Upload</span>
          </button>

          <button
            className="creative-nav-item"
            onClick={() =>
              go("/documents")
            }
          >
            <b>▣</b>
            <span>Documents</span>
          </button>

          <button
            className="creative-nav-item"
            onClick={() =>
              go("/analytics")
            }
          >
            <b>▥</b>
            <span>Analytics</span>
          </button>

          <button className="creative-nav-item active">
            <b>♧</b>
            <span>Notifications</span>
          </button>

          <button
            className="creative-nav-item"
            onClick={() =>
              go("/profile")
            }
          >
            <b>♙</b>
            <span>Profile</span>
          </button>

          <button
            className="creative-nav-item"
            onClick={() =>
              go("/settings")
            }
          >
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

      <main className="creative-main">

        {/* TOPBAR */}

        <div className="topbar">

          <div className="search-box">

            🔍

            <input
              placeholder="Search notifications..."
            />

          </div>

          <div className="top-actions">

            <button
              onClick={() => {
                const newMode = !darkMode;

                setDarkMode(newMode);

                localStorage.setItem(
                  "darkMode",
                  newMode
                );
              }}
            >
              {darkMode ? "☀" : "◐"}
            </button>

            <button
              onClick={() =>
                go("/upload")
              }
            >
              ↥
            </button>

            <button className="notification-active">
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
              DOCUMENT INTELLIGENCE
            </p>

            <h1>
              Notifications 🔔
            </h1>

            <p>
              Stay updated with your document
              verification activity.
            </p>

          </div>

          <button
            className="main-upload"
            onClick={() =>
              go("/upload")
            }
          >
            ↥ Upload Document
          </button>

        </section>

        {/* NOTIFICATIONS */}

        <section className="creative-card recent-card">

          <div className="chart-heading">

            <div>

              <h2>
                Recent Activity
              </h2>

              <p>
                Your latest document updates
              </p>

            </div>

            <div className="notification-count">
              {notifications.length}{" "}
              Notifications
            </div>

          </div>

          {loading ? (

            <div className="notification-empty">

              <div className="loader"></div>

              <p>
                Loading notifications...
              </p>

            </div>

          ) : notifications.length === 0 ? (

            <div className="notification-empty">

              <div className="empty-icon">
                🔔
              </div>

              <h3>
                No notifications yet
              </h3>

              <p>
                Upload and verify a document
                to see activity here.
              </p>

              <button
                onClick={() =>
                  go("/upload")
                }
              >
                Upload Document
              </button>

            </div>

          ) : (

            <div className="notification-list">

              {notifications.map(
                (notification) => (

                  <div
                    className={`notification-card ${notification.type}`}
                    key={notification.id}
                  >

                    <div className="notification-icon">

                      {getIcon(
                        notification.type
                      )}

                    </div>

                    <div className="notification-content">

                      <h3>
                        {notification.title}
                      </h3>

                      <p>
                        {notification.message}
                      </p>

                      <span>
                        {notification.created_at
                          ? new Date(
                              notification.created_at
                            ).toLocaleString()
                          : "Recently"}
                      </span>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </section>

      </main>

      {/* RIGHT PANEL */}

      <aside className="right-insight">

        <div className="insight-orb">
          ◇
        </div>

        <h3>
          Document
          <br />
          Insights
        </h3>

        <p>
          Your verification activity
          appears here in real time.
        </p>

        <div className="insight-line"></div>

        <strong>
          {notifications.length}
        </strong>

        <span>
          Notifications
        </span>

        <div className="robot">
          🔔
        </div>

      </aside>

    </div>
  );
}

export default Notifications;