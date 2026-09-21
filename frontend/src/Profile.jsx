import { useEffect, useState } from "react";
import "./Profile.css";

function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [profile, setProfile] = useState({
    id: "",
    full_name: "",
    email: "",
    phone: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    full_name: "",
    phone: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const go = (path) => {
    window.location.href = path;
  };

  useEffect(() => {
    if (!user?.id) return;

    fetch(`http://127.0.0.1:8000/api/profile/${user.id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setProfile(data.profile);

          setEditData({
            full_name: data.profile.full_name || "",
            phone: data.profile.phone || "",
          });
        }

        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching profile:", error);
        setLoading(false);
      });
  }, []);

  const handleEdit = () => {
    setEditData({
      full_name: profile.full_name || "",
      phone: profile.phone || "",
    });

    setMessage("");
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditData({
      full_name: profile.full_name || "",
      phone: profile.phone || "",
    });

    setMessage("");
    setEditMode(false);
  };

  const handleChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    if (!editData.full_name.trim()) {
      setMessage("Full name is required.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/profile/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            full_name: editData.full_name,
            phone: editData.phone,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setProfile(data.profile);

        setEditData({
          full_name: data.profile.full_name || "",
          phone: data.profile.phone || "",
        });

        setEditMode(false);
        setMessage("Profile updated successfully.");

        // Update local user name if needed
        const currentUser = JSON.parse(
          localStorage.getItem("user")
        );

        if (currentUser) {
          currentUser.full_name = data.profile.full_name;
          localStorage.setItem(
            "user",
            JSON.stringify(currentUser)
          );
        }
      } else {
        setMessage(
          data.message || "Failed to update profile."
        );
      }
    } catch (error) {
      console.error("Profile update error:", error);
      setMessage("Unable to update profile.");
    }

    setSaving(false);
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
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
            <span>AI Document Intelligence</span>
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

          <button className="creative-nav-item active">
            <b>♙</b>
            <span>Profile</span>
          </button>

          <button
            className="creative-nav-item"
            onClick={() => go("/settings")}
          >
            <b>⚙</b>
            <span>Settings</span>
          </button>

        </nav>

        <div className="sidebar-user">

          <div className="avatar">
            {profile.full_name
              ? profile.full_name.charAt(0).toUpperCase()
              : "U"}
          </div>

          <div>
            <strong>
              {profile.full_name || user?.email || "User"}
            </strong>
          </div>

        </div>

        <button
          className="creative-logout"
          onClick={logout}
        >
          ⇥ Logout
        </button>

      </aside>

      {/* MAIN */}

      <main className="profile-main">

        <div className="profile-header">

          <div>
            <p className="profile-eyebrow">
           </p>

            <h1>My Profile</h1>

            
          </div>

          <div className="profile-header-actions">

            {!editMode ? (
              <button
                className="edit-profile-btn"
                onClick={handleEdit}
              >
                ✎ Edit Profile
              </button>
            ) : (
              <>
                <button
                  className="cancel-profile-btn"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  className="save-profile-btn"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "✓ Save Changes"}
                </button>
              </>
            )}

            <div className="profile-avatar">
              {profile.full_name
                ? profile.full_name.charAt(0).toUpperCase()
                : "U"}
            </div>

          </div>

        </div>

        {message && (
          <div className="profile-message">
            {message}
          </div>
        )}

        {loading ? (

          <div className="profile-loading">
            Loading profile...
          </div>

        ) : (

          <section className="profile-card">

            <div className="profile-cover"></div>

            <div className="profile-main-info">

              <div className="large-profile-avatar">
                {profile.full_name
                  ? profile.full_name.charAt(0).toUpperCase()
                  : "U"}
              </div>

              <div>

                {editMode ? (
                  <input
                    className="profile-name-input"
                    name="full_name"
                    value={editData.full_name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                  />
                ) : (
                  <h2>
                    {profile.full_name || "User"}
                  </h2>
                )}

                <p>
                  {profile.email}
                </p>

              </div>

            </div>

            <div className="profile-details">

              <div className="profile-field">

                <label>Full Name</label>

                {editMode ? (
                  <input
                    type="text"
                    name="full_name"
                    value={editData.full_name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                  />
                ) : (
                  <div>
                    {profile.full_name || "Not available"}
                  </div>
                )}

              </div>

              <div className="profile-field">

                <label>Email Address</label>

                <div>
                  {profile.email || "Not available"}
                </div>

              </div>

              <div className="profile-field">

                <label>Phone Number</label>

                {editMode ? (
                  <input
                    type="tel"
                    name="phone"
                    value={editData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                  />
                ) : (
                  <div>
                    {profile.phone || "Not provided"}
                  </div>
                )}

              </div>

              <div className="profile-field">

                <label>Account ID</label>

                <div className="profile-id">
                  {profile.id}
                </div>

              </div>

            </div>

          </section>

        )}

      </main>

      {/* RIGHT PANEL */}

      <aside className="right-insight">

        <div className="insight-orb">
          ◇
        </div>

        <h3>
          Secure
          <br />
          Profile
        </h3>

        <p>
          Your account information is connected to your document workspace.
        </p>

      </aside>

    </div>
  );
}

export default Profile;