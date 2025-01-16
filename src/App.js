import React, { Suspense, useEffect } from "react";
import { HashRouter, Route, Routes, Navigate } from "react-router-dom";
import { CSpinner, useColorModes } from "@coreui/react";
import "./scss/style.scss";

// Lazy-loaded components
const DefaultLayout = React.lazy(() => import("./layout/DefaultLayout"));
const Login = React.lazy(() => import("./views/pages/login/Login"));
const Register = React.lazy(() => import("./views/pages/register/Register"));
const Page404 = React.lazy(() => import("./views/pages/page404/Page404"));
const Page500 = React.lazy(() => import("./views/pages/page500/Page500"));

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes("coreui-free-react-admin-template-theme");

  const isAuthenticated = (() => {
    const token = localStorage.getItem("token");
    const roles = localStorage.getItem("roles");
    const permissions = localStorage.getItem("permissions");
  
    if (!token || !roles || !permissions) {
      console.warn("Authentication failed: Missing token, roles, or permissions");
      return false;
    }
  
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const payload = JSON.parse(atob(base64));
      const isExpired = Date.now() >= payload.exp * 1000;
      return !isExpired;
    } catch (error) {
      console.error("Token decoding failed:", error);
      return false;
    }
  })();
  
  

  useEffect(() => {
    // Handle theme initialization
    const urlParams = new URLSearchParams(window.location.href.split("?")[1]);
    const theme = urlParams.get("theme") && urlParams.get("theme").match(/^[A-Za-z0-9\s]+/)[0];
    if (theme) {
      setColorMode(theme);
    }

    if (!isColorModeSet()) {
      setColorMode("light"); // Default theme
    }

    // Handle missing authentication details
    const token = localStorage.getItem("token");
    const roles = localStorage.getItem("roles");
    const permissions = localStorage.getItem("permissions");

    if (!token || !roles || !permissions) {
      // Redirect to login if any required data is missing
      window.location.href = "/#/login";
    }

    // Listen for logout events (localStorage change)
    const handleLogout = () => {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        window.location.href = "/#/login";
      }
    };

    window.addEventListener("storage", handleLogout);

    return () => {
      window.removeEventListener("storage", handleLogout);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <HashRouter>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
          {/* Public Routes */}
          <Route path="/login" name="Login Page" element={<Login />} />
          <Route path="/register" name="Register Page" element={<Register />} />
          <Route path="/404" name="Page 404" element={<Page404 />} />
          <Route path="/500" name="Page 500" element={<Page500 />} />

          {/* Protected Routes */}
          <Route
            path="*"
            name="Home"
            element={
              isAuthenticated ? (
                <DefaultLayout />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </Suspense>
    </HashRouter>
  );
};

export default App;
