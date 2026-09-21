import { useEffect, useState } from "react";

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

function App() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleNavigation = () => {
      setPath(window.location.pathname);
    };

    window.addEventListener("popstate", handleNavigation);

    return () => {
      window.removeEventListener("popstate", handleNavigation);
    };
  }, []);

  const navigate = (newPath) => {
    window.history.pushState({}, "", newPath);
    setPath(newPath);
  };

  // Make navigation available to all pages
  window.navigate = navigate;

  if (path === "/dashboard") {
    return <Dashboard />;
  }

  if (path === "/upload") {
    return <UploadDocument />;
  }

  if (path === "/documents") {
    return <Documents />;
  }

  if (path === "/analytics") {
    return <Analytics />;
  }

  if (path === "/notifications") {
    return <Notifications />;
  }

  if (path === "/profile") {
    return <Profile />;
  }

  if (path === "/settings") {
    return <Settings />;
  }

  if (path === "/register") {
    return <Register />;
  }

  if (path.startsWith("/document/")) {
    return <DocumentDetails />;
  }

  return <Login />;
}

export default App;