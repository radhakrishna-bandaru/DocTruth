import { useEffect, useState } from "react";
import "./Documents.css";

function Documents() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  const go = (path) => {
    window.location.href = path;
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        if (!user?.id) return;

        const response = await fetch(
          `http://127.0.0.1:8000/api/dashboard/${user.id}`
        );

        const data = await response.json();

        if (response.ok) {
          setDocuments(data.documents || []);
        }
      } catch (error) {
        console.error("Documents error:", error);
      }
    };

    loadDocuments();
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    const value = !darkMode;

    setDarkMode(value);

    localStorage.setItem(
      "darkMode",
      value.toString()
    );
  };

  const filteredDocuments = documents.filter(
    (doc) => {
      const query = search.toLowerCase().trim();

      const matchesSearch =
        !query ||
        doc.file_name
          ?.toLowerCase()
          .includes(query) ||
        doc.document_type
          ?.toLowerCase()
          .includes(query) ||
        doc.status
          ?.toLowerCase()
          .includes(query);

      const matchesFilter =
        filter === "all" ||
        (filter === "pending"
          ? doc.status === "uploaded" ||
            doc.status === "ocr_completed"
          : doc.status === filter);

      return matchesSearch && matchesFilter;
    }
  );

  const verifiedCount = documents.filter(
    (doc) => doc.status === "verified"
  ).length;

  const suspiciousCount = documents.filter(
    (doc) => doc.status === "suspicious"
  ).length;

  const pendingCount = documents.filter(
    (doc) =>
      doc.status === "uploaded" ||
      doc.status === "ocr_completed"
  ).length;

  return (
    <div
      className={`documents-shell ${
        darkMode ? "documents-dark" : ""
      }`}
    >

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

          <button className="creative-nav-item active">
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

          <button
            className="creative-nav-item"
            onClick={() =>
              go("/notifications")
            }
          >
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

        <button
          className="creative-logout"
          onClick={logout}
        >
          ⇥ Logout
        </button>

      </aside>

      {/* MAIN */}

      <main className="documents-main">

        {/* TOPBAR */}

        <div className="documents-topbar">

          <div className="documents-search">
            🔍

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search documents..."
            />

          </div>

          <div className="documents-actions">

            <button
              onClick={toggleDarkMode}
              title={
                darkMode
                  ? "Light Mode"
                  : "Dark Mode"
              }
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

            <button
              onClick={() =>
                go("/notifications")
              }
            >
              ♧
            </button>

            <div
              className="documents-profile"
              onClick={() =>
                go("/profile")
              }
            >

              <div className="documents-avatar small">
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

        <div className="documents-header">

          <div>

            <p>
              DOCUMENT MANAGEMENT
            </p>

            <h1>
              My Documents
            </h1>

            <span>
              View and manage all your
              uploaded documents.
            </span>

          </div>

          <button
            onClick={() =>
              go("/upload")
            }
          >
            ↥ Upload Document
          </button>

        </div>

        {/* SUMMARY */}

        <div className="documents-summary">

          <div>
            <span>Total</span>
            <strong>
              {documents.length}
            </strong>
          </div>

          <div>
            <span>Verified</span>
            <strong>
              {verifiedCount}
            </strong>
          </div>

          <div>
            <span>Pending</span>
            <strong>
              {pendingCount}
            </strong>
          </div>

          <div>
            <span>Suspicious</span>
            <strong>
              {suspiciousCount}
            </strong>
          </div>

        </div>

        {/* FILTERS */}

        <div className="documents-toolbar">

          <div className="document-count">

            <strong>
              {filteredDocuments.length}
            </strong>

            <span>
              Documents
            </span>

          </div>

          <div className="status-filters">

            <button
              className={
                filter === "all"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setFilter("all")
              }
            >
              All
            </button>

            <button
              className={
                filter === "verified"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setFilter("verified")
              }
            >
              Verified
            </button>

            <button
              className={
                filter === "suspicious"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setFilter("suspicious")
              }
            >
              Suspicious
            </button>

            <button
              className={
                filter === "pending"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setFilter("pending")
              }
            >
              Pending
            </button>

          </div>

        </div>

        {/* DOCUMENTS */}

        <section className="documents-card">

          {filteredDocuments.length === 0 ? (

            <div className="documents-empty">

              <div>📄</div>

              <h2>
                No Documents Found
              </h2>

              <p>
                {search
                  ? "Try a different search."
                  : "Upload a document to see it here."}
              </p>

              {!search && (
                <button
                  onClick={() =>
                    go("/upload")
                  }
                >
                  Upload Document
                </button>
              )}

            </div>

          ) : (

            <div className="documents-list">

              {filteredDocuments.map(
                (doc) => (

                  <div
                    className="document-item"
                    key={doc.id}
                  >

                    <div className="document-file">

                      <div className="document-file-icon">
                        📄
                      </div>

                      <div>

                        <strong>
                          {doc.file_name}
                        </strong>

                        <span>
                          {doc.document_type ||
                            "Unknown Document"}
                        </span>

                      </div>

                    </div>

                    <div className="document-status-box">

                      <span
                        className={`document-status ${doc.status}`}
                      >
                        {doc.status}
                      </span>

                    </div>

                    <div className="document-date-box">

                      <span>
                        Uploaded
                      </span>

                      <strong>
                        {doc.created_at
                          ? new Date(
                              doc.created_at
                            ).toLocaleDateString()
                          : "N/A"}
                      </strong>

                    </div>

                    <button
                      className="document-view-btn"
                      onClick={() =>
                        go(
                          `/document/${doc.id}`
                        )
                      }
                    >
                      View →
                    </button>

                  </div>

                )
              )}

            </div>

          )}

        </section>

      </main>

      {/* RIGHT PANEL */}

      <aside className="documents-right-panel">

        <div className="documents-orb">
          ◇
        </div>

        <h3>
          Document
          <br />
          Vault
        </h3>

        <p>
          Everything
          <br />
          in one place.
        </p>

        <div className="documents-line"></div>

        <strong>
          {documents.length}
        </strong>

        <span>
          Total
        </span>

        <strong className="documents-green">
          {verifiedCount}
        </strong>

        <span>
          Verified
        </span>

        <strong className="documents-red">
          {suspiciousCount}
        </strong>

        <span>
          Suspicious
        </span>

        <div className="documents-robot">
          🤖
        </div>

      </aside>

    </div>
  );
}

export default Documents;