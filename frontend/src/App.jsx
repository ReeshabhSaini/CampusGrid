import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import SDashboard from "./pages/StudentDashboard/SDashboard";
import TDashboard from "./pages/TeacherDashboard/TDashboard";
import ReschedulePage from "./pages/TeacherDashboard/Reschedule";
import EditStudentProfile from "./pages/StudentDashboard/editProfile";
import EditProfessorProfile from "./pages/TeacherDashboard/editProfile";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import TimetableUpload from "./pages/AdminDashboard/TimeTableUpload";
import HolidaysUpload from "./pages/AdminDashboard/HolidaysUpload";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const decodeJWT = (token) => {
  if (!token) return null;
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = atob(base64);
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Invalid token or decoding failed:", error);
    return null;
  }
};

const getRedirectPath = (token) => {
  if (!token) return "/login";

  const decodedToken = decodeJWT(token);
  if (!decodedToken) return "/login";

  const currentTime = Math.floor(Date.now() / 1000);
  if (decodedToken.exp && decodedToken.exp < currentTime) {
    console.log("Token has expired");
    localStorage.removeItem("token");
    return "/login";
  }

  const role = decodedToken.role;
  return role === "student"
    ? "/sdashboard"
    : role === "professor"
    ? "/tdashboard"
    : role === "admin"
    ? "/admin-dashboard"
    : "/login";
};

const App = () => {
  const token = localStorage.getItem("token");
  const redirectPath = getRedirectPath(token);

  return (
    <div>
      <ToastContainer />
      <Routes>
        {/* Redirect root path based on token */}
        <Route path="/" element={<Navigate to={redirectPath} replace />} />

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
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
        <Route
          path="/tdashboard/reschedule"
          element={
            <ProtectedRoute>
              <ReschedulePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/edit-profile"
          element={
            <ProtectedRoute>
              <EditStudentProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/professor/edit-profile"
          element={
            <ProtectedRoute>
              <EditProfessorProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard-timetable"
          element={
            <ProtectedRoute>
              <TimetableUpload />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard-holidays"
          element={
            <ProtectedRoute>
              <HolidaysUpload />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
