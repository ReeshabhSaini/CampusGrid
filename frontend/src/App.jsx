import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import SDashboard from "./pages/StudentDashboard/SDashboard";
import TDashboard from "./pages/TeacherDashboard/TDashboard";

// Manual JWT Decoder
function decodeJWT(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = atob(base64);
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Invalid token or decoding failed:", error);
    return null;
  }
}

const App = () => {
  const token = localStorage.getItem("token");

  const getRedirectPath = () => {
    if (!token) {
      return "/login"; // If no token, redirect to login
    }

    const decodedToken = decodeJWT(token);
    console.log(decodedToken);
    if (!decodedToken) {
      return "/login"; // If token is invalid, redirect to login
    }

    const currentTime = Date.now() / 1000; // Current time in seconds
    if (decodedToken.exp && decodedToken.exp < currentTime) {
      console.log("Token has expired");
      localStorage.removeItem("token");
      return "/login"; // If token has expired, redirect to login
    }

    // Redirect based on user role
    const role = decodedToken.role.role; // Assumes `role` is present in token payload
    if (role === "student") {
      return "/sdashboard";
    } else if (role === "professor") {
      return "/tdashboard";
    }

    return "/login"; // Fallback to login if role is unknown
  };

  const redirectPath = getRedirectPath();

  return (
    <Routes>
      {/* Redirect from "/" based on token */}
      <Route path="/" element={<Navigate to={redirectPath} replace />} />

      {/* Login Page */}
      <Route path="/login" element={<Login />} />
      {/* Register Page */}
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route
        path="/sdashboard"
        element={
          <ProtectedRoute>
            <SDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tdashboard"
        element={
          <ProtectedRoute>
            <TDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
