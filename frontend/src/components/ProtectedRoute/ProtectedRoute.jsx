import React, { useContext } from "react";
import { Navigate } from "react-router-dom";

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

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    // Redirect to login if no token exists
    return <Navigate to="/login" replace />;
  }

  const decodedToken = decodeJWT(token);

  if (!decodedToken) {
    // Redirect to login if token is invalid
    return <Navigate to="/login" replace />;
  }

  const currentTime = Date.now() / 1000; // Current time in seconds
  if (decodedToken.exp && decodedToken.exp < currentTime) {
    // Remove expired token and redirect to login
    console.log("Token has expired");
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }

  // Allow access if the token is valid
  return children;
};

export default ProtectedRoute;
