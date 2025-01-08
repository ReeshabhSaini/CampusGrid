import React, { useContext, useEffect, useState } from "react";
import Profile from "./Profile";
import Timetable from "./Timetable";
import ReschedulePage from "./Reschedule";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { assets } from "../../assets/assets";

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

const TDashboard = () => {
  const [activeSection, setActiveSection] = useState("Profile");
  const [selectedEvent, setSelectedEvent] = useState(null); // State to handle selected event for rescheduling
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true); // State to toggle sidebar collapse
  const { setProfessorData, setToken, url, decodedToken } =
    useContext(StoreContext);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  console.log("Token:", token); // Check if token exists

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfessorDetails = async () => {
      try {
        const decodedToken = decodeJWT(token);
        console.log("Decoded Token:", decodedToken);

        if (!decodedToken) {
          setToken("");
          navigate("/login");
          return;
        }

        const { professor_id: id } = decodedToken;
        const response = await axios.post(
          `${url}/api/auth/professor/details`,
          { professor_id: decodedToken.id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("API Response:", response);

        if (response.data.status) {
          const { requiredData } = response.data;
          setProfessorData({
            id: requiredData.id,
            first_name: requiredData.first_name,
            last_name: requiredData.last_name,
            email: requiredData.email,
          });
        } else {
          console.error(
            "Error Fetching Professor Details",
            response.data.message
          );
          alert("Failed to fetch professor details.");
        }
      } catch (error) {
        console.error("Error in fetching professor details:", error);
        alert("An error occurred. Please try again.");
        logout();
      }
    };

    fetchProfessorDetails();
  }, [token, setProfessorData, navigate, url]);

  const renderSection = () => {
    switch (activeSection) {
      case "Profile":
        return <Profile />;
      case "Timetable":
        return (
          <Timetable
            onSelectEvent={(event) => {
              setSelectedEvent(event);
              setActiveSection("Reschedule"); // Navigate to ReschedulePage after selecting an event
            }}
          />
        );
      case "Reschedule":
        return (
          <ReschedulePage
            event={selectedEvent}
            onBack={() => setActiveSection("Timetable")} // Navigate back to Timetable
          />
        );
      default:
        return <Profile />;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/login");
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[auto_1fr]">
      {/* Sidebar */}
      <div
        className={` bg-transparent transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? "w-16" : "w-64"
        }`}
        onMouseEnter={() => setIsSidebarCollapsed(false)}
        onMouseLeave={() => setIsSidebarCollapsed(true)}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-14 items-center border-b border-transparent px-4">
            <img
              src={assets.Logo}
              alt="Campus Grid Logo"
              className="w-10 h-10 object-contain"
            />
            {!isSidebarCollapsed && (
              <span className="ml-2 text-lg font-bold text-green-600">
                Campus
              </span>
            )}
            {!isSidebarCollapsed && (
              <span className="ml-2 text-lg font-bold text-gray-600">Grid</span>
            )}
          </div>
          <nav className="flex-1 p-4 space-y-4">
            <button
              className={`flex items-center w-full text-left px-4 py-2 rounded-md transition-all duration-300 ${
                activeSection === "Profile"
                  ? "bg-blue-100 text-blue-600"
                  : "hover:bg-transparent"
              }`}
              onClick={() => setActiveSection("Profile")}
            >
              <img
                src={assets.ProfileIcon}
                alt="Profile Icon"
                className="w-5 h-5 object-contain mr-2"
              />
              {!isSidebarCollapsed && "Profile"}
            </button>
            <button
              className={`flex items-center w-full text-left px-4 py-2 rounded-md transition-all duration-300 ${
                activeSection === "Timetable"
                  ? "bg-blue-100 text-blue-600"
                  : "hover:bg-transparent"
              }`}
              onClick={() => setActiveSection("Timetable")}
            >
              <img
                src={assets.TimetableIcon}
                alt="Timetable Icon"
                className="w-5 h-5 object-contain mr-2"
              />
              {!isSidebarCollapsed && "Timetable"}
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col">
        {/* Header */}
        <header className="flex h-14  justify-between border-b border-transparent px-4 bg-transparent">
          <button
            className="md:hidden p-2 rounded-md hover:bg-transparent"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          >
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
        <main className="flex flex-1 flex-col  p-4 m-5 border rounded-lg shadow-lg">

          {renderSection()}
        </main>
      </div>
    </div>
  );
};

export default TDashboard;
