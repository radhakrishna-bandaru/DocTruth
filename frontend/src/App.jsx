import { useState } from "react";

import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import UploadDocument from "./UploadDocument";
import Documents from "./Documents";
import Analytics from "./Analytics";
import Notifications from "./Notifications";
import Profile from "./Profile";
import Settings from "./Settings";
import DocumentDetails from "./DocumentDetails";

function SimplePage({ title, icon, description }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "60px",
        background: "#f7f9ff",
        fontFamily: "Inter, Arial",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "auto",
          background: "white",
          padding: "45px",
          borderRadius: "25px",
          boxShadow: "0 15px 40px rgba(50,60,130,.08)",
        }}
      >
        <div style={{ fontSize: "45px" }}>
          {icon}
        </div>

        <h1
          style={{
            color: "#14213d",
            marginTop: "15px",
          }}
        >
          {title}
        </h1>

        <p
          style={{
            color: "#71809f",
            marginTop: "10px",
          }}
        >
          {description}
        </p>

        <button
          onClick={() =>
            (window.location.href = "/dashboard")
          }
          style={{
            marginTop: "25px",
            border: "none",
            padding: "13px 22px",
            borderRadius: "12px",
            background:
              "linear-gradient(100deg,#306cff,#a334ff)",
            color: "white",
            cursor: "pointer",
            fontWeight: "700",
          }}
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}

function App() {
  const path = window.location.pathname;

  const [page] = useState(path);

  if (page === "/dashboard") {
    return <Dashboard />;
  }

  if (page === "/upload") {
    return <UploadDocument />;
  }

  if (page === "/documents") {
  return <Documents />;
}

 if (page === "/analytics") {
  return <Analytics />;
}

if (page === "/notifications") {
  return <Notifications />;
}
if (page === "/profile") {
  return <Profile />;
} 

if (page === "/settings") {
  return <Settings />;
}

  if (page === "/register") {
    return <Register />;
  }
  if (page.startsWith("/document/")) {
  return <DocumentDetails />;
}

  return <Login />;
}

export default App;