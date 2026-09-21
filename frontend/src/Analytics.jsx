import { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";
import "./Analytics.css";

function Analytics() {
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

  const [period, setPeriod] = useState("all");
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
    const loadAnalytics = async () => {
      try {
        if (!user?.id) return;

        const response = await fetch(
          `/api/dashboard/${user.id}`
        );

        const result = await response.json();

        if (response.ok) {
          setData(result);
        }
      } catch (error) {
        console.error("Analytics error:", error);
      }
    };

    loadAnalytics();
  }, []);

  useEffect(() => {
    const savedTheme =
      localStorage.getItem("darkMode") === "true";

    setDarkMode(savedTheme);

    if (savedTheme) {
      document.body.classList.add("dark-mode");
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;

    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);

    if (newMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  };

  // -----------------------------
  // PERIOD FILTER
  // -----------------------------

  const filteredDocuments = useMemo(() => {
    const documents = data.documents || [];

    if (period === "all") {
      return documents;
    }

    const now = new Date();

    return documents.filter((doc) => {
      if (!doc.created_at) return false;

      const date = new Date(doc.created_at);

      if (period === "week") {
        const start = new Date(now);
        start.setDate(now.getDate() - 7);
        return date >= start;
      }

      if (period === "month") {
        const start = new Date(now);
        start.setDate(now.getDate() - 30);
        return date >= start;
      }

      if (period === "threeMonths") {
        const start = new Date(now);
        start.setMonth(now.getMonth() - 3);
        return date >= start;
      }

      if (period === "year") {
        const start = new Date(now);
        start.setFullYear(now.getFullYear() - 1);
        return date >= start;
      }

      return true;
    });
  }, [data.documents, period]);

  // -----------------------------
  // ANALYTICS NUMBERS
  // -----------------------------

  const analytics = useMemo(() => {
    const documents = filteredDocuments;

    const verified = documents.filter(
      (d) => d.status === "verified"
    ).length;

    const suspicious = documents.filter(
      (d) => d.status === "suspicious"
    ).length;

    const pending = documents.filter(
      (d) =>
        d.status === "uploaded" ||
        d.status === "ocr_completed"
    ).length;

    const total = documents.length;

    const verificationRate =
      total > 0
        ? Math.round((verified / total) * 100)
        : 0;

    const suspiciousRate =
      total > 0
        ? Math.round((suspicious / total) * 100)
        : 0;

    return {
      total,
      verified,
      pending,
      suspicious,
      verificationRate,
      suspiciousRate,
    };
  }, [filteredDocuments]);

  // -----------------------------
  // STATUS DATA
  // -----------------------------

  const statusData = [
    {
      name: "Verified",
      value: analytics.verified,
    },
    {
      name: "Pending",
      value: analytics.pending,
    },
    {
      name: "Suspicious",
      value: analytics.suspicious,
    },
  ];

  // -----------------------------
  // DOCUMENT TYPE DATA
  // -----------------------------

  const typeData = useMemo(() => {
    const counts = {};

    filteredDocuments.forEach((document) => {
      const type =
        document.document_type || "Unknown";

      counts[type] = (counts[type] || 0) + 1;
    });

    return Object.entries(counts).map(
      ([name, value]) => ({
        name,
        value,
      })
    );
  }, [filteredDocuments]);

  // -----------------------------
  // ACTIVITY DATA
  // -----------------------------

  const activityData = useMemo(() => {
    const months = {};

    filteredDocuments.forEach((document) => {
      if (!document.created_at) return;

      const date = new Date(document.created_at);

      const key = date.toLocaleString("en-US", {
        month: "short",
        year: "numeric",
      });

      months[key] = (months[key] || 0) + 1;
    });

    return Object.entries(months).map(
      ([month, documents]) => ({
        month,
        documents,
      })
    );
  }, [filteredDocuments]);

  // -----------------------------
  // CHECK STATUS
  // -----------------------------

  const checkData = useMemo(() => {
    const counts = {
      Passed: 0,
      Failed: 0,
      Warnings: 0,
    };

    /*
      verification_results are not returned by
      dashboard API currently.

      Therefore this chart is intentionally
      not showing fake numbers.
    */

    return Object.entries(counts).map(
      ([name, value]) => ({
        name,
        value,
      })
    );
  }, []);

  const periodLabel = {
    all: "All Time",
    week: "This Week",
    month: "This Month",
    threeMonths: "Last 3 Months",
    year: "This Year",
  }[period];

  return (
    <div
      className={`analytics-shell ${
        darkMode ? "analytics-dark" : ""
      }`}
    >

      {/* SIDEBAR */}

      <aside className="analytics-sidebar">

        <div className="analytics-brand">

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

        <nav className="analytics-nav">

          <button onClick={() => go("/dashboard")}>
            <b>⌂</b>
            Dashboard
          </button>

          <button onClick={() => go("/upload")}>
            <b>↥</b>
            Upload
          </button>

          <button onClick={() => go("/documents")}>
            <b>▣</b>
            Documents
          </button>

          <button
            className="active"
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

          <button onClick={() => go("/profile")}>
            <b>♙</b>
            Profile
          </button>

          <button onClick={() => go("/settings")}>
            <b>⚙</b>
            Settings
          </button>

        </nav>

        <div className="analytics-user">

          <div className="analytics-avatar">
            {user?.email
              ?.charAt(0)
              .toUpperCase() || "U"}
          </div>

          <strong>
            {user?.email || "User"}
          </strong>

        </div>

        <button
          className="analytics-logout"
          onClick={logout}
        >
          ⇥ Logout
        </button>

      </aside>

      {/* MAIN */}

      <main className="analytics-main">

        {/* TOPBAR */}

        <div className="analytics-topbar">

          <div className="analytics-search">
            🔍

            <input
              placeholder="Search analytics..."
            />
          </div>

          <div className="analytics-actions">

            <button onClick={toggleDarkMode}>
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
              className="analytics-profile"
              onClick={() => go("/profile")}
            >

              <div className="analytics-avatar small">
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

        {/* HEADER */}

        <section className="analytics-header">

          <div>

            <p>DATA INSIGHTS</p>

            <h1>Analytics</h1>

            <span>
              Detailed insights into your
              document verification activity.
            </span>

          </div>

          <div className="analytics-header-actions">

            <select
  className="analytics-period-select"
  value={period}
  onChange={(e) => setPeriod(e.target.value)}
>
  <option value="week">This Week</option>
  <option value="month">This Month</option>
  <option value="threeMonths">Last 3 Months</option>
  <option value="year">This Year</option>
  <option value="all">All Time</option>
</select>

            <button
              onClick={() => go("/upload")}
            >
              ↥ Upload Document
            </button>

          </div>

        </section>

        {/* INSIGHT SUMMARY */}

        <section className="analytics-summary">

          <div className="summary-main">

            <span>Verification Rate</span>

            <strong>
              {analytics.verificationRate}%
            </strong>

            <p>
              Based on {analytics.total} documents
              in {periodLabel.toLowerCase()}.
            </p>

          </div>

          <div className="summary-item">

            <span>Total Analysed</span>

            <strong>
              {analytics.total}
            </strong>

          </div>

          <div className="summary-item">

            <span>Verified</span>

            <strong className="summary-green">
              {analytics.verified}
            </strong>

          </div>

          <div className="summary-item">

            <span>Needs Review</span>

            <strong className="summary-red">
              {analytics.suspicious}
            </strong>

          </div>

        </section>

        {/* FIRST ROW */}

        <section className="analytics-grid">

          {/* STATUS */}

          <div className="analytics-card">

            <div className="analytics-card-title">

              <div>
                <h2>
                  Verification Distribution
                </h2>

                <p>
                  Status breakdown for{" "}
                  {periodLabel.toLowerCase()}.
                </p>
              </div>

            </div>

            <div className="analytics-chart">

              {analytics.total === 0 ? (

                <div className="analytics-empty">
                  No verification data available.
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
                      cx="42%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={105}
                      paddingAngle={5}
                    >

                      <Cell fill="#18c47c" />
                      <Cell fill="#ffad32" />
                      <Cell fill="#ff4d5f" />

                    </Pie>

                    <Tooltip />

                    <Legend
                      verticalAlign="middle"
                      align="right"
                      layout="vertical"
                    />

                  </PieChart>

                </ResponsiveContainer>

              )}

            </div>

          </div>

          {/* TYPE */}

          <div className="analytics-card">

            <div className="analytics-card-title">

              <div>
                <h2>
                  Document Type Analysis
                </h2>

                <p>
                  Categories found in uploaded
                  documents.
                </p>
              </div>

            </div>

            <div className="analytics-chart">

              {typeData.length === 0 ? (

                <div className="analytics-empty">
                  No document type data.
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
                      bottom: 20,
                    }}
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                      opacity={0.2}
                    />

                    <XAxis dataKey="name" />

                    <YAxis
                      allowDecimals={false}
                    />

                    <Tooltip />

                    <Bar
                      dataKey="value"
                      fill="#7655ff"
                      radius={[
                        9,
                        9,
                        0,
                        0,
                      ]}
                    />

                  </BarChart>

                </ResponsiveContainer>

              )}

            </div>

          </div>

        </section>

        {/* ACTIVITY */}

        <div className="analytics-card trend-card">

          <div className="analytics-card-title">

            <div>

              <h2>
                Document Activity
              </h2>

              <p>
                Upload activity across the
                selected period.
              </p>

            </div>

          </div>

          <div className="trend-chart">

            {activityData.length === 0 ? (

              <div className="analytics-empty">
                No activity available yet.
              </div>

            ) : (

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <AreaChart
                  data={activityData}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    opacity={0.18}
                  />

                  <XAxis dataKey="month" />

                  <YAxis
                    allowDecimals={false}
                  />

                  <Tooltip />

                  <Area
                    type="monotone"
                    dataKey="documents"
                    stroke="#7055ff"
                    fill="#7055ff"
                    fillOpacity={0.15}
                    strokeWidth={3}
                  />

                </AreaChart>

              </ResponsiveContainer>

            )}

          </div>

        </div>

        {/* METRICS */}

        
      </main>

      {/* RIGHT PANEL */}

      <aside className="analytics-right-panel">

        <div className="analytics-orb">
          ◇
        </div>

        <h3>
          Data
          <br />
          Insights
        </h3>

        <p>
          Understand
          <br />
          your data.
        </p>

        <div className="analytics-line"></div>

        <strong>
          {analytics.total}
        </strong>

        <span>
          Analysed
        </span>

        <strong className="analytics-green">
          {analytics.verificationRate}%
        </strong>

        <span>
          Verification Rate
        </span>

        <strong className="analytics-red">
          {analytics.suspicious}
        </strong>

        <span>
          Needs Review
        </span>

        <div className="analytics-robot">
          📊
        </div>

      </aside>

    </div>
  );
}

export default Analytics;