import { useEffect, useMemo, useState } from "react";
import "./Dashboard.css";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [data, setData] = useState({
    total: 0,
    verified: 0,
    pending: 0,
    suspicious: 0,
    documents: [],
    status_counts: {},
    type_counts: {},
  });

  const [profileName, setProfileName] = useState("");

  const [period, setPeriod] = useState("month");

  const [search, setSearch] = useState("");

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const currentUser = JSON.parse(
          localStorage.getItem("user")
        );

        if (!currentUser?.id) return;

        const response = await fetch(
          `/api/dashboard/${currentUser.id}`
        );

        const result = await response.json();

        if (response.ok) {
          setData(result);
        }
      } catch (error) {
        console.error("Dashboard error:", error);
      }
    };

    const loadProfile = async () => {
      try {
        const currentUser = JSON.parse(
          localStorage.getItem("user")
        );

        if (!currentUser?.id) return;

        const response = await fetch(
          `/api/profile/${currentUser.id}`
        );

        const result = await response.json();

        if (response.ok && result.success) {
          setProfileName(result.profile?.full_name || "");
        }
      } catch (error) {
        console.error("Profile error:", error);
      }
    };

    loadDashboard();
    loadProfile();
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);

    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  const go = (path) => {
    window.location.href = path;
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const toggleDarkMode = () => {
    setDarkMode((previous) => !previous);
  };

  // --------------------------------
  // PERIOD FILTER
  // --------------------------------

  const getFilteredDocuments = useMemo(() => {
    const documents = data.documents || [];

    const now = new Date();

    if (period === "all") {
      return documents;
    }

    return documents.filter((doc) => {
      if (!doc.created_at) return false;

      const createdDate = new Date(doc.created_at);

      if (Number.isNaN(createdDate.getTime())) {
        return false;
      }

      if (period === "week") {
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(now.getDate() - 7);

        return createdDate >= sevenDaysAgo;
      }

      if (period === "month") {
        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(now.getDate() - 30);

        return createdDate >= thirtyDaysAgo;
      }

      if (period === "threeMonths") {
        const threeMonthsAgo = new Date(now);
        threeMonthsAgo.setMonth(now.getMonth() - 3);

        return createdDate >= threeMonthsAgo;
      }

      if (period === "year") {
        const oneYearAgo = new Date(now);
        oneYearAgo.setFullYear(now.getFullYear() - 1);

        return createdDate >= oneYearAgo;
      }

      return true;
    });
  }, [data.documents, period]);

  // --------------------------------
  // SEARCH
  // --------------------------------

  const searchedDocuments = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return data.documents || [];
    }

    return (data.documents || []).filter((doc) => {
      return (
        doc.file_name?.toLowerCase().includes(query) ||
        doc.document_type?.toLowerCase().includes(query) ||
        doc.status?.toLowerCase().includes(query)
      );
    });
  }, [data.documents, search]);

  // --------------------------------
  // CHART DOCUMENTS
  // --------------------------------

  const statusData = useMemo(() => {
    const documents = getFilteredDocuments;

    return [
      {
        name: "Verified",
        value: documents.filter(
          (doc) => doc.status === "verified"
        ).length,
      },
      {
        name: "Pending",
        value: documents.filter(
          (doc) =>
            doc.status === "uploaded" ||
            doc.status === "ocr_completed"
        ).length,
      },
      {
        name: "Suspicious",
        value: documents.filter(
          (doc) => doc.status === "suspicious"
        ).length,
      },
    ];
  }, [getFilteredDocuments]);

  const typeData = useMemo(() => {
    const counts = {};

    getFilteredDocuments.forEach((document) => {
      const type = document.document_type || "Unknown";

      if (!counts[type]) {
        counts[type] = 0;
      }

      counts[type] += 1;
    });

    return Object.entries(counts).map(
      ([name, value]) => ({
        name,
        value,
      })
    );
  }, [getFilteredDocuments]);

  // --------------------------------
  // PERIOD LABEL
  // --------------------------------

  const periodLabel = {
    week: "This Week",
    month: "This Month",
    threeMonths: "Last 3 Months",
    year: "This Year",
    all: "All Time",
  }[period];

  return (
    <div
      className={`dashboard-shell ${
        darkMode ? "dashboard-dark" : ""
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
            className="creative-nav-item active"
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
            {(
              profileName ||
              user?.email ||
              "U"
            )
              .charAt(0)
              .toUpperCase()}
          </div>

          <div>
            <strong>
              {profileName ||
                user?.email ||
                "User"}
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

      <main className="creative-main">

        {/* TOPBAR */}

        <div className="topbar">

          <div className="search-box">

            🔍

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search documents, reports..."
            />

          </div>

          <div className="top-actions">

            <button
              title={
                darkMode
                  ? "Light Mode"
                  : "Dark Mode"
              }
              onClick={toggleDarkMode}
            >
              {darkMode ? "☀" : "◐"}
            </button>

            <button
              title="Upload Document"
              onClick={() => go("/upload")}
            >
              ↥
            </button>

            <button
              title="Notifications"
              onClick={() =>
                go("/notifications")
              }
            >
              ♧
            </button>

            <div
              className="top-user"
              onClick={() => go("/profile")}
            >

              <div className="avatar small">

                {(
                  profileName ||
                  user?.email ||
                  "U"
                )
                  .charAt(0)
                  .toUpperCase()}

              </div>

              <span>
                {profileName ||
                  user?.email ||
                  "User"}
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
              Welcome Back! 👋
            </h1>

            <h3>
              Welcome back,{" "}
              {profileName ||
                user?.email ||
                "User"}
            </h3>

            <p>
              Manage, verify and analyze
              your documents with AI.
            </p>

          </div>

          <button
            className="main-upload"
            onClick={() => go("/upload")}
          >
            ↥ Upload Document
          </button>

        </section>

        {/* STATS */}

        <section className="creative-stats">

          <div className="creative-stat blue">

            <div className="stat-symbol">
              ▤
            </div>

            <div>
              <span>
                Total Documents
              </span>

              <strong>
                {data.total}
              </strong>

              <small>
                ↗ Documents scanned
              </small>
            </div>

          </div>

          <div className="creative-stat green">

            <div className="stat-symbol">
              ✓
            </div>

            <div>
              <span>Verified</span>

              <strong>
                {data.verified}
              </strong>

              <small>
                Successfully verified
              </small>
            </div>

          </div>

          <div className="creative-stat orange">

            <div className="stat-symbol">
              ◷
            </div>

            <div>
              <span>Pending</span>

              <strong>
                {data.pending}
              </strong>

              <small>
                Awaiting verification
              </small>
            </div>

          </div>

          <div className="creative-stat red">

            <div className="stat-symbol">
              !
            </div>

            <div>
              <span>Suspicious</span>

              <strong>
                {data.suspicious}
              </strong>

              <small>
                Needs attention
              </small>
            </div>

          </div>

        </section>

        {/* CHARTS */}

        <section className="creative-charts">

          {/* VERIFICATION */}

          <div className="creative-card">

            <div className="chart-heading">

              <div>

                <h2>
                  Verification Overview
                </h2>

                <p>
                  Current document verification
                  status
                </p>

              </div>

              <select
                value={period}
                onChange={(e) =>
                  setPeriod(e.target.value)
                }
                className="chart-period-select"
              >
                <option value="week">
                  This Week
                </option>

                <option value="month">
                  This Month
                </option>

                <option value="threeMonths">
                  Last 3 Months
                </option>

                <option value="year">
                  This Year
                </option>

                <option value="all">
                  All Time
                </option>
              </select>

            </div>

            <div className="chart-container">

              {statusData.every(
                (item) => item.value === 0
              ) ? (

                <div className="empty-chart">
                  No documents found for{" "}
                  {periodLabel}.
                </div>

              ) : (

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

                  <PieChart>

                    <Pie
                      data={statusData}
                      dataKey="value"
                      nameKey="name"
                      cx="40%"
                      cy="50%"
                      outerRadius={100}
                      innerRadius={62}
                      paddingAngle={5}
                      animationBegin={0}
                      animationDuration={1200}
                      label
                    >

                      <Cell fill="#18c47c" />
                      <Cell fill="#ffad32" />
                      <Cell fill="#ff4d5f" />

                    </Pie>

                    <Tooltip />

                    <Legend
                      layout="vertical"
                      verticalAlign="middle"
                      align="right"
                    />

                  </PieChart>

                </ResponsiveContainer>

              )}

            </div>

          </div>

          {/* DOCUMENT TYPES */}

          <div className="creative-card">

            <div className="chart-heading">

              <div>

                <h2>
                  Documents by Type
                </h2>

                <p>
                  Distribution of uploaded
                  documents
                </p>

              </div>

              <select
                value={period}
                onChange={(e) =>
                  setPeriod(e.target.value)
                }
                className="chart-period-select"
              >

                <option value="week">
                  This Week
                </option>

                <option value="month">
                  This Month
                </option>

                <option value="threeMonths">
                  Last 3 Months
                </option>

                <option value="year">
                  This Year
                </option>

                <option value="all">
                  All Time
                </option>

              </select>

            </div>

            <div className="chart-container">

              {typeData.length === 0 ? (

                <div className="empty-chart">
                  No document data available
                  for {periodLabel}.
                </div>

              ) : (

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

                  <BarChart
                    data={typeData}
                    margin={{
                      top: 20,
                      right: 15,
                      left: 0,
                      bottom: 10,
                    }}
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                      opacity={0.2}
                    />

                    <XAxis
                      dataKey="name"
                    />

                    <YAxis
                      allowDecimals={false}
                    />

                    <Tooltip />

                    <Bar
                      dataKey="value"
                      radius={[
                        10,
                        10,
                        0,
                        0,
                      ]}
                      animationBegin={0}
                      animationDuration={1200}
                      fill="#6c4cff"
                    />

                  </BarChart>

                </ResponsiveContainer>

              )}

            </div>

          </div>

        </section>

        {/* RECENT DOCUMENTS */}

        <section className="creative-card recent-card">

          <div className="chart-heading">

            <div>

              <h2>
                Recent Documents
              </h2>

              <p>
                {search
                  ? `Search results for "${search}"`
                  : "Your latest uploaded documents"}
              </p>

            </div>

            <button
              className="view-all"
              onClick={() => go("/documents")}
            >
              View All →
            </button>

          </div>

          {searchedDocuments.length === 0 ? (

            <div className="empty-state">

              <div>📄</div>

              <h3>
                {search
                  ? "No matching documents"
                  : "No documents yet"}
              </h3>

              <p>
                {search
                  ? "Try another search."
                  : "Upload your first document to begin."}
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

            <div className="document-list">

              {searchedDocuments
                .slice(0, 5)
                .map((doc) => (

                  <div
                    className="creative-document"
                    key={doc.id}
                  >

                    <div className="document-left">

                      <div className="file-icon">
                        📄
                      </div>

                      <div>

                        <strong>
                          {doc.file_name}
                        </strong>

                        <span>
                          {doc.document_type ||
                            "Unknown"}
                        </span>

                      </div>

                    </div>

                    <span
                      className={`document-status ${doc.status}`}
                    >
                      {doc.status}
                    </span>

                    <span className="document-date">

                      {new Date(
                        doc.created_at
                      ).toLocaleDateString()}

                    </span>

                    <button
                      className="document-action"
                      onClick={() =>
                        go(
                          `/document/${doc.id}`
                        )
                      }
                    >
                      View
                    </button>

                  </div>

                ))}

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
          Authentic
          <br />
          Documents
        </h3>

        <p>
          Build a safer
          <br />
          digital world.
        </p>

        <div className="insight-line"></div>

        <strong>
          {data.total}
        </strong>

        <span>
          Total Scanned
        </span>

        <strong className="green-number">
          {data.verified}
        </strong>

        <span>
          Verified
        </span>

        <strong className="red-number">
          {data.suspicious}
        </strong>

        <span>
          Suspicious
        </span>

        <div className="robot">
          🤖
        </div>

      </aside>

    </div>
  );
}

export default Dashboard;