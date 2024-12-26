import React, { useContext, useState } from "react";
import Profile from "./Profile";
import Timetable from "./Timetable";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const SDashboard = () => {
  const [activeSection, setActiveSection] = useState("Profile");
  const { token, setToken } = useContext(StoreContext);
  const navigate = useNavigate();

  const renderSection = () => {
    switch (activeSection) {
      case "Profile":
        return <Profile />;
      case "Timetable":
        return <Timetable />;
      default:
        return <Profile />;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* Sidebar */}
      <div className="hidden border-r bg-transparent md:block">
        <div className="flex h-full flex-col">
          <div className="flex h-14 items-center border-b border-transparent px-4">
            <a href="/" className="font-bold text-lg">
              Student <span className="text-blue-600">Dashboard</span>
            </a>
          </div>
          <nav className="flex-1 p-4 space-y-4">
            <button
              className={`block w-full text-left px-4 py-2 rounded-md ${
                activeSection === "Profile"
                  ? "bg-blue-100 text-blue-600"
                  : "hover:bg-transparent"
              }`}
              onClick={() => setActiveSection("Profile")}
            >
              Profile
            </button>
            <button
              className={`block w-full text-left px-4 py-2 rounded-md ${
                activeSection === "Timetable"
                  ? "bg-blue-100 text-blue-600"
                  : "hover:bg-transparent"
              }`}
              onClick={() => setActiveSection("Timetable")}
            >
              Timetable
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col">
        {/* Header */}
        <header className="flex h-14 items-center justify-between border-b border-transparent px-4">
          {/* Mobile Menu Button */}
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

          {/* User Menu and Logout Button */}
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

export default SDashboard;
