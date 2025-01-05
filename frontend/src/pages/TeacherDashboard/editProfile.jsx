import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";

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

const EditProfessorProfile = () => {
  const { url } = useContext(StoreContext);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfessorDetails = async () => {
      try {
        const decodedToken = decodeJWT(token);
        if (!decodedToken) {
          console.error("Invalid token. Redirecting to login.");
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }
    
        const { id: professor_id } = decodedToken; // Decode the token to get professor_id
    
        const response = await axios.post(
          `${url}/api/auth/professor/details`,
          { professor_id }, // Send professor_id in the body
          {
            headers: {
              Authorization: `Bearer ${token}`, // Pass headers correctly
            },
          }
        );
    
        if (response.data.status && response.data.requiredData) {
          const { requiredData } = response.data;
    
          // Populate form with professor data
          setFormData((prevData) => ({
            ...prevData,
            first_name: requiredData.first_name || "",
            last_name: requiredData.last_name || "",
            email: requiredData.email || "",
          }));
        } else {
          console.error(
            "Error Fetching Professor Details:",
            response.data.message
          );
          alert("Failed to fetch professor details.");
        }
      } catch (error) {
        console.error("Error fetching professor details:", error);
        alert("An error occurred. Please try again.");
      }
    };
    
    fetchProfessorDetails();
  }, [token, url, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const decodedToken = decodeJWT(token);
      if (!decodedToken) {
        console.error("Invalid token. Redirecting to login.");
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      const { id } = decodedToken;

      const response = await axios.post(
        `${url}/api/auth/professor/update-profile`,
        { ...formData, id }
      );

      if (response.data.status) {
        navigate("/tdashboard");
      } else {
        alert(response.data.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Error submitting profile update:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-6">Edit Profile</h2>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 space-y-4"
      >
        {/* First Name */}
        <div>
          <label
            htmlFor="first_name"
            className="block mb-2 text-sm font-medium text-indigo-600 text-left"
          >
            First Name
          </label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-300 focus:outline-none"
          />
        </div>

        {/* Last Name */}
        <div>
          <label
            htmlFor="last_name"
            className="block mb-2 text-sm font-medium text-indigo-600 text-left"
          >
            Last Name
          </label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-300 focus:outline-none"
          />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-indigo-600 text-left"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-300 focus:outline-none"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 mb-4 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          Save Changes
        </button>

        {/* Back Button */}
        <button
          type="button"
          className="w-full py-3 text-white bg-gray-600 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
          onClick={() => navigate("/tdashboard")}
        >
          Back
        </button>
      </form>
    </div>
  );
};

export default EditProfessorProfile;
