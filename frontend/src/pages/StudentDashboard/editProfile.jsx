import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";

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

const EditStudentProfile = () => {
  const { url } = useContext(StoreContext);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    branch: "",
    semester: "",
    student_id: "",
    class_group: "",
    tutorial_group: "",
    lab_group: "",
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchStudentDetails = async () => {
      try {
        const decodedToken = decodeJWT(token);
        if (!decodedToken) {
          console.error("Invalid token. Redirecting to login.");
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        const { id } = decodedToken;

        const response = await axios.post(`${url}/api/auth/student/details`, {
          id,
        });

        if (response.data.status && response.data.requiredData) {
          const { requiredData } = response.data;

          // Populate form with student data
          setFormData((prevData) => ({
            ...prevData,
            first_name: requiredData.first_name || "",
            last_name: requiredData.last_name || "",
            email: requiredData.email || "",
            branch: requiredData.branch || "",
            semester: requiredData.semester || "",
            student_id: requiredData.student_id || "",
            class_group: requiredData.class_group || "",
            tutorial_group: requiredData.tutorial_group || "",
            lab_group: requiredData.lab_group || "",
          }));
        } else {
          console.error(
            "Error Fetching Student Details:",
            response.data.message
          );
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching student details:", error);
        toast.error(response.data.message);
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchStudentDetails();
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
        `${url}/api/auth/student/update-profile`,
        { ...formData, id }
      );

      if (response.data.status) {
        navigate("/sdashboard");
      } else {
        alert(response.data.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Error submitting profile update:", error);
      toast.error(response.data.message);
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

        {/* Branch */}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-indigo-600 text-left">
            Branch
          </label>
          <select
            name="branch"
            onChange={handleChange}
            value={studentData.branch}
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-300 focus:outline-none"
            required
          >
            <option value="" disabled>
              Select Your Branch
            </option>
            <option value="CSE">Computer Science and Engineering</option>
            <option value="CSE-DS">
              Computer Science and Engineering (Data Science)
            </option>
            <option value="CSE-AI">
              Computer Science and Engineering (Artificial Intelligence)
            </option>
            <option value="ECE">
              Electronics and Communication Engineering
            </option>
            <option value="EE">Electrical Engineering</option>
            <option value="Mech">Mechanical Engineering</option>
            <option value="Civil">Civil Engineering</option>
            <option value="Civil">Aerospace Engineering</option>
            <option value="Meta">
              Metallurgical and Materials Engineering
            </option>
            <option value="Prod">Production and Industrial Engineering</option>
          </select>
        </div>

        {/* Semester */}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-indigo-600 text-left">
            Semester
          </label>
          <select
            name="semester"
            onChange={handleChange}
            value={formData.semester}
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-300 focus:outline-none"
            required
          >
            <option value="" disabled>
              Select Semester
            </option>
            <option value="1">1st</option>
            <option value="2">2nd</option>
            <option value="3">3rd</option>
            <option value="4">4th</option>
            <option value="5">5th</option>
            <option value="6">6th</option>
            <option value="7">7th</option>
            <option value="8">8th</option>
          </select>
        </div>

        {/* Class Group */}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-indigo-600 text-left">
            Class Group
          </label>
          <select
            name="class_group"
            onChange={handleChange}
            value={studentData.class_group}
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-300 focus:outline-none"
            required
          >
            <option value="" disabled>
              Select Class Group
            </option>
            <option value="G1">G1</option>
            <option value="G2">G2</option>
          </select>
        </div>

        {/* Tutorial Group */}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-indigo-600 text-left">
            Tutorial Group
          </label>
          <select
            name="tutorial_group"
            onChange={handleChange}
            value={studentData.tutorial_group}
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-300 focus:outline-none"
            required
          >
            <option value="" disabled>
              Select Tutorial Group
            </option>
            <option value="G1">G1</option>
            <option value="G2">G2</option>
            <option value="G3">G3</option>
            <option value="G4">G4</option>
            <option value="G5">G5</option>
            <option value="G6">G6</option>
            <option value="G7">G7</option>
            <option value="G8">G8</option>
          </select>
        </div>

        {/* Lab Group */}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-indigo-600 text-left">
            Lab Group
          </label>
          <select
            name="lab_group"
            onChange={handleChange}
            value={studentData.lab_group}
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-300 focus:outline-none"
            required
          >
            <option value="" disabled>
              Select Lab Group
            </option>
            <option value="G1">G1</option>
            <option value="G2">G2</option>
            <option value="G3">G3</option>
            <option value="G4">G4</option>
            <option value="G5">G5</option>
            <option value="G6">G6</option>
            <option value="G7">G7</option>
            <option value="G8">G8</option>
          </select>
        </div>

        {/* Student ID */}
        <div>
          <label
            htmlFor="student_id"
            className="block mb-2 text-sm font-medium text-indigo-600 text-left"
          >
            Student ID
          </label>
          <input
            type="text"
            id="student_id"
            name="student_id"
            value={formData.student_id}
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
          onClick={() => navigate("/sdashboard")}
        >
          Back
        </button>
      </form>
    </div>
  );
};

export default EditStudentProfile;
