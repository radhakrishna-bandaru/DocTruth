import { useEffect, useState } from "react";
import "./DocumentDetails.css";

function DocumentDetails() {
  const documentId =
    window.location.pathname.split("/")[2];

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const go = (path) => {
    window.location.href = path;
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  useEffect(() => {
    fetch(
      `/api/document/${documentId}`
    )
      .then((response) => response.json())
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch((error) => {
        console.error(
          "Error fetching document:",
          error
        );
        setLoading(false);
      });
  }, [documentId]);

  if (loading) {
    return (
      <div className="document-details-loading">
        Loading document details...
      </div>
    );
  }

  if (!data?.success) {
    return (
      <div className="document-details-error">

        <h2>
          Document not found
        </h2>

        <button
          onClick={() =>
            go("/documents")
          }
        >
          ← Back to Documents
        </button>

      </div>
    );
  }

  const document = data.document;

  const extractedData =
    data.extracted_data || [];

  const verificationResults =
    data.verification_results || [];

  return (
    <div className="document-details-page">

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
            className="creative-nav-item active"
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

      <main className="document-details-main">

        <header className="document-details-topbar">

          <div>

            <button
              className="back-button"
              onClick={() =>
                go("/documents")
              }
            >
              ← Back to Documents
            </button>

           

            <h1>
              Document Details
            </h1>

            <p>
              Review extracted information
              and verification results.
            </p>

          </div>

        </header>

        {/* SUMMARY */}

        <section className="document-summary">

          <div className="document-icon">
            📄
          </div>

          <div className="document-title">

            <h2>
              {document.file_name}
            </h2>

            <span>
              {document.document_type ||
                "Unknown"}
            </span>

          </div>

          <div
            className={`document-status ${document.status}`}
          >
            {document.status}
          </div>

        </section>

        {/* INFORMATION */}

        <section className="details-grid">

          {/* DOCUMENT INFORMATION */}

          <div className="details-card">

            <div className="card-heading">

              <h2>
                Document Information
              </h2>

            </div>

            <div className="info-list">

              <div>

                <span>
                  File Name
                </span>

                <strong>
                  {document.file_name}
                </strong>

              </div>

              <div>

                <span>
                  Document Type
                </span>

                <strong>
                  {document.document_type ||
                    "Unknown"}
                </strong>

              </div>

              <div>

                <span>
                  Status
                </span>

                <strong>
                  {document.status}
                </strong>

              </div>

              <div>

                <span>
                  Uploaded On
                </span>

                <strong>
                  {document.created_at
                    ? new Date(
                        document.created_at
                      ).toLocaleString()
                    : "N/A"}
                </strong>

              </div>

            </div>

          </div>

          {/* EXTRACTED DATA */}

          <div className="details-card">

            <div className="card-heading">

              <h2>
                Extracted Information
              </h2>

            </div>

            {extractedData.length === 0 ? (

              <div className="empty-details">
                No extracted information
                available.
              </div>

            ) : (

              <div className="extracted-list">

                {extractedData.map(
                  (item) => (

                    <div
                      className="extracted-item"
                      key={item.id}
                    >

                      <span>
                        {item.field_name}
                      </span>

                      <strong>
                        {item.field_value ||
                          "—"}
                      </strong>

                    </div>

                  )
                )}

              </div>

            )}

          </div>

        </section>

        {/* VERIFICATION */}

        <section className="verification-card">

          <div className="card-heading">

            <h2>
              Verification Checks
            </h2>

            <span>
              {verificationResults.length}{" "}
              checks
            </span>

          </div>

          {verificationResults.length === 0 ? (

            <div className="empty-details">
              No verification checks
              available.
            </div>

          ) : (

            <div className="verification-list">

              {verificationResults.map(
                (result) => (

                  <div
                    className="verification-item"
                    key={result.id}
                  >

                    <div className="verification-check-icon">

                      {result.status ===
                      "passed"
                        ? "✓"
                        : result.status ===
                          "warning"
                        ? "!"
                        : "×"}

                    </div>

                    <div className="verification-content">

                      <h3>
                        {result.check_name}
                      </h3>

                      <p>
                        {result.reason}
                      </p>

                    </div>

                    <span
                      className={`verification-status ${result.status}`}
                    >
                      {result.status}
                    </span>

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
          Review extracted information
          and verification checks.
        </p>

        <div className="insight-line"></div>

        <strong>
          {verificationResults.length}
        </strong>

        <span>
          Verification Checks
        </span>

        <strong className="green-number">
          {
            verificationResults.filter(
              (item) =>
                item.status === "passed"
            ).length
          }
        </strong>

        <span>
          Passed
        </span>

        <strong className="red-number">
          {
            verificationResults.filter(
              (item) =>
                item.status === "failed"
            ).length
          }
        </strong>

        <span>
          Failed
        </span>

        <div className="robot">
          📄
        </div>

      </aside>

    </div>
  );
}

export default DocumentDetails;