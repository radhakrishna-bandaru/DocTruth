import { useEffect,useState } from "react";
import "./UploadDocument.css";

function UploadDocument() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
const [darkMode, setDarkMode] = useState(
  localStorage.getItem("darkMode") === "true"
);

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
  const go = (path) => {
    window.location.href = path;
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a document first.");
      return;
    }

    if (!user?.id) {
      setMessage("User session not found. Please login again.");
      return;
    }

    try {
      setLoading(true);
      setMessage("Uploading and processing...");
      setResult(null);

      const formData = new FormData();

      formData.append("file", file);
      formData.append("user_id", user.id);

      const uploadResponse = await fetch(
        "http://127.0.0.1:8000/api/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const uploadData = await uploadResponse.json();

      if (!uploadResponse.ok) {
        setMessage(
          uploadData.detail ||
            "Document upload failed."
        );
        return;
      }

      const documentId =
        uploadData.document?.[0]?.id;

      if (!documentId) {
        setMessage(
          "Document ID was not returned."
        );
        return;
      }

      setMessage(
        "Document uploaded. Running OCR..."
      );

      const ocrFormData = new FormData();

      ocrFormData.append("file", file);

      const ocrResponse = await fetch(
        `http://127.0.0.1:8000/api/ocr/${documentId}`,
        {
          method: "POST",
          body: ocrFormData,
        }
      );

      const ocrData =
        await ocrResponse.json();

      if (!ocrResponse.ok) {
        setMessage(
          ocrData.detail ||
            "OCR processing failed."
        );
        return;
      }

      setResult(ocrData);
      setMessage("");

    } catch (error) {
      console.error(error);

      setMessage(
        "Unable to connect to backend."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-shell">

      {/* ================= SIDEBAR ================= */}

      <aside className="upload-sidebar">

        <div className="upload-brand">

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

        <nav className="upload-nav">

          <button
            onClick={() => go("/dashboard")}
          >
            <b>⌂</b>
            Dashboard
          </button>

          <button
            className="active"
            onClick={() => go("/upload")}
          >
            <b>↥</b>
            Upload
          </button>

          <button
            onClick={() => go("/documents")}
          >
            <b>▣</b>
            Documents
          </button>

          <button
            onClick={() => go("/analytics")}
          >
            <b>▥</b>
            Analytics
          </button>

          <button
            onClick={() => go("/notifications")}
          >
            <b>♧</b>
            Notifications
          </button>

          <button
            onClick={() => go("/profile")}
          >
            <b>♙</b>
            Profile
          </button>

          <button
            onClick={() => go("/settings")}
          >
            <b>⚙</b>
            Settings
          </button>

        </nav>

        <div className="upload-sidebar-user">

          <div className="upload-avatar">
            {user?.email
              ?.charAt(0)
              .toUpperCase() || "U"}
          </div>

          <strong>
            {user?.email || "User"}
          </strong>

        </div>

        <button
          className="upload-logout"
          onClick={logout}
        >
          ⇥ Logout
        </button>

      </aside>

      {/* ================= MAIN ================= */}

      <main className="upload-main">

        {/* TOP BAR */}

        <div className="upload-topbar">

          <div className="upload-search">
            🔍

            <input
              placeholder="Search documents..."
            />
          </div>

          <div className="upload-top-actions">

            <button
  onClick={toggleDarkMode}
  title={darkMode ? "Light Mode" : "Dark Mode"}
>
  {darkMode ? "☀" : "◐"}
</button>

            <button
              onClick={() =>
                go("/notifications")
              }
            >
              ♧
            </button>

            <div
              className="upload-profile"
              onClick={() =>
                go("/profile")
              }
            >
              <div className="upload-avatar small">
                {user?.email
                  ?.charAt(0)
                  .toUpperCase() || "U"}
              </div>

              <span>
                {user?.email}
              </span>
            </div>

          </div>

        </div>

        {/* PAGE HEADER */}

        <div className="upload-page-header">

          <div>

            <p className="upload-eyebrow">
              DOCUMENT VERIFICATION
            </p>

            <h1>
              Upload & Verify
            </h1>

            <p>
              Upload your document and let
              DocTruth analyze it using OCR
              and verification checks.
            </p>

          </div>

          <button
            className="upload-back"
            onClick={() =>
              go("/dashboard")
            }
          >
            ← Dashboard
          </button>

        </div>

        {/* ================= UPLOAD AREA ================= */}

        <section className="upload-workspace">

          <div className="upload-drop-card">

            <div className="big-upload-icon">
              📄
            </div>

            <h2>
              Upload Your Document
            </h2>

            <p>
              PDF, JPG and PNG files are
              supported
            </p>

            <label className="file-picker">

              <span>
                Choose Document
              </span>

              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => {

                  setFile(
                    e.target.files[0]
                  );

                  setMessage("");
                  setResult(null);

                }}
              />

            </label>

            {file && (

              <div className="selected-upload-file">

                <div className="selected-file-icon">
                  📄
                </div>

                <div>
                  <strong>
                    {file.name}
                  </strong>

                  <span>
                    {(file.size / 1024 / 1024)
                      .toFixed(2)} MB
                  </span>
                </div>

                <button
                  onClick={() => {
                    setFile(null);
                    setResult(null);
                    setMessage("");
                  }}
                >
                  ×
                </button>

              </div>

            )}

            <button
              className="verify-upload-btn"
              onClick={handleUpload}
              disabled={loading}
            >

              {loading
                ? "⏳ Processing..."
                : "↥ Upload & Verify"}

            </button>

            {message && (
              <div className="upload-status-message">
                {message}
              </div>
            )}

          </div>

          {/* SIDE INFORMATION */}

          <div className="upload-info-card">

            <div className="info-orb">
              ✦
            </div>

            <h2>
              AI Verification
            </h2>

            <p>
              Your document goes through
              multiple intelligent checks.
            </p>

            <div className="process-step">

              <span>01</span>

              <div>
                <strong>
                  OCR Extraction
                </strong>

                <p>
                  Extract text and important
                  information.
                </p>
              </div>

            </div>

            <div className="process-step">

              <span>02</span>

              <div>
                <strong>
                  Classification
                </strong>

                <p>
                  Identify the document type.
                </p>
              </div>

            </div>

            <div className="process-step">

              <span>03</span>

              <div>
                <strong>
                  Verification
                </strong>

                <p>
                  Check extracted information.
                </p>
              </div>

            </div>

          </div>

        </section>

        {/* ================= RESULT ================= */}

        {result && (

          <section className="verification-result-section">

            <div
              className={`verification-banner ${
                result.status === "verified"
                  ? "verified"
                  : "suspicious"
              }`}
            >

              <div className="verification-icon">

                {result.status === "verified"
                  ? "✓"
                  : "!"}

              </div>

              <div>

                <span>
                  VERIFICATION RESULT
                </span>

                <h2>
                  {result.status ===
                  "verified"
                    ? "Document Verified"
                    : "Document Suspicious"}
                </h2>

                <p>
                  {result.status ===
                  "verified"
                    ? "All available verification checks passed."
                    : "One or more verification checks require attention."}
                </p>

              </div>

            </div>

            {/* DOCUMENT INFO */}

            <div className="result-grid">

              <div className="result-card">

                <span>
                  Document Type
                </span>

                <strong>
                  {result.document_type}
                </strong>

              </div>

              <div className="result-card">

                <span>
                  File Name
                </span>

                <strong>
                  {result.file_name}
                </strong>

              </div>

              <div className="result-card">

                <span>
                  Status
                </span>

                <strong>
                  {result.status}
                </strong>

              </div>

            </div>

            {/* EXTRACTED FIELDS */}

            <div className="result-panel">

              <div className="result-panel-title">

                <div>
                  <h2>
                    Extracted Information
                  </h2>

                  <p>
                    Information identified
                    from the document
                  </p>
                </div>

                <span>
                  OCR
                </span>

              </div>

              <div className="extracted-grid">

                {Object.keys(
                  result.fields || {}
                ).length === 0 ? (

                  <p>
                    No fields extracted.
                  </p>

                ) : (

                  Object.entries(
                    result.fields
                  ).map(
                    ([key, value]) => (

                      <div
                        className="extracted-field"
                        key={key}
                      >

                        <span>
                          {key.replace(
                            "_",
                            " "
                          )}
                        </span>

                        <strong>
                          {value}
                        </strong>

                      </div>

                    )
                  )

                )}

              </div>

            </div>

            {/* VERIFICATION CHECKS */}

            <div className="result-panel">

              <div className="result-panel-title">

                <div>
                  <h2>
                    Verification Checks
                  </h2>

                  <p>
                    Individual verification
                    results
                  </p>
                </div>

                <span>
                  CHECKS
                </span>

              </div>

              <div className="verification-checks">

                {result.verification_results?.map(
                  (check, index) => (

                    <div
                      className={`verification-check ${
                        check.status
                      }`}
                      key={index}
                    >

                      <div className="check-symbol">

                        {check.status ===
                        "passed"
                          ? "✓"
                          : check.status ===
                            "warning"
                          ? "!"
                          : "×"}

                      </div>

                      <div>

                        <strong>
                          {check.check_name}
                        </strong>

                        <p>
                          {check.reason}
                        </p>

                      </div>

                      <span>
                        {check.status}
                      </span>

                    </div>

                  )
                )}

              </div>

            </div>

            {/* OCR TEXT */}

            <div className="result-panel">

              <div className="result-panel-title">

                <div>
                  <h2>
                    OCR Extracted Text
                  </h2>

                  <p>
                    Text detected from your
                    uploaded document
                  </p>
                </div>

                <span>
                  TEXT
                </span>

              </div>

              <div className="ocr-result">

                {result.text ||
                  "No OCR text available."}

              </div>

            </div>

          </section>

        )}

      </main>

      {/* RIGHT PANEL */}

      <aside className="upload-right-panel">

        <div className="upload-right-orb">
          ◇
        </div>

        <h3>
          Smart
          <br />
          Verification
        </h3>

        <p>
          Analyze
          <br />
          documents
        </p>

        <div className="right-line"></div>

        <div className="right-stat">
          <strong>AI</strong>
          <span>Powered</span>
        </div>

        <div className="right-stat">
          <strong>OCR</strong>
          <span>Extraction</span>
        </div>

        <div className="right-stat">
          <strong>✓</strong>
          <span>Checks</span>
        </div>

        <div className="upload-robot">
          🤖
        </div>

      </aside>

    </div>
  );
}

export default UploadDocument;