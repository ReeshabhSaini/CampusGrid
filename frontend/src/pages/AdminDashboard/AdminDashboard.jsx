import React, { useContext, useEffect, useState } from "react";
import TimetableUpload from "./TimeTableUpload";
import HolidaysUpload from "./HolidaysUpload";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("Timetable");
  const { setToken, url } = useContext(StoreContext);
  const navigate = useNavigate();
  //   const token = localStorage.getItem("token");

  //   useEffect(() => {
  //     if (!token) {
  //       navigate("/login");
  //       return;
  //     }

  //     const validateAdminToken = () => {
  //       const decodedToken = decodeJWT(token);
  //       if (!decodedToken || decodedToken.role !== "admin") {
  //         alert("Unauthorized access! Only admins are allowed.");
  //         logout();
  //       }
  //     };

  //     validateAdminToken();
  //   }, [token, navigate]);

  const renderSection = () => {
    switch (activeSection) {
      case "Timetable":
        return <TimetableUpload />;
      case "Holidays":
        return <HolidaysUpload />;
      default:
        return <TimetableUpload />;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/login");
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* Sidebar */}
      <div className="hidden border-r bg-transparent md:block">
        <div className="flex h-full flex-col">
          <div className="flex h-14 items-center border-b border-transparent px-4">
            <a href="/" className="font-bold text-lg">
              Admin<span className="text-blue-600">Dashboard</span>
            </a>
          </div>
          <nav className="flex-1 p-4 space-y-4">
            <button
              className={`block w-full text-left px-4 py-2 rounded-md ${
                activeSection === "Timetable"
                  ? "bg-blue-100 text-blue-600"
                  : "hover:bg-transparent"
              }`}
              onClick={() => setActiveSection("Timetable")}
            >
              Upload Timetable
            </button>
            <button
              className={`block w-full text-left px-4 py-2 rounded-md ${
                activeSection === "Holidays"
                  ? "bg-blue-100 text-blue-600"
                  : "hover:bg-transparent"
              }`}
              onClick={() => setActiveSection("Holidays")}
            >
              Upload Holidays
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col">
        {/* Header */}
        <header className="flex h-14 items-center justify-between border-b border-transparent px-4">
          <button className="md:hidden p-2 rounded-md hover:bg-transparent">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <div className="flex items-center space-x-4 ml-auto">
            <div className="w-8 h-8 bg-transparent rounded-full" />
            <button
              onClick={logout}
              className="text-sm font-medium px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition duration-300 ease-in-out"
            >
              Log out
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex flex-1 flex-col gap-4 p-4">
          {renderSection()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
