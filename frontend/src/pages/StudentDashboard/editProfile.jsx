import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";

const EditProfile = () => {
  const { studentData, setStudentData } = useContext(StoreContext);
  const [formData, setFormData] = useState({
    first_name: studentData.first_name || "",
    last_name: studentData.last_name || "",
    email: studentData.email || "",
    password: "",
    confirmPassword: "",
    branch: studentData.branch || "",
    semester: studentData.semester || "",
    student_id: studentData.student_id || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
  
   
    setStudentData(formData);
  localStorage.setItem("studentData", JSON.stringify(formData));
  alert("Profile updated successfully!");
  navigate("/profile");
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
            className="block text-sm font-medium text-gray-700"
          >
            First Name
          </label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Last Name */}
        <div>
          <label
            htmlFor="last_name"
            className="block text-sm font-medium text-gray-700"
          >
            Last Name
          </label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Branch */}
        <div>
          <label
            htmlFor="branch"
            className="block text-sm font-medium text-gray-700"
          >
            Branch
          </label>
          <input
            type="text"
            id="branch"
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Semester */}
        <div>
          <label
            htmlFor="semester"
            className="block text-sm font-medium text-gray-700"
          >
            Semester
          </label>
          <input
            type="text"
            id="semester"
            name="semester"
            value={formData.semester}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Student ID */}
        <div>
          <label
            htmlFor="student_id"
            className="block text-sm font-medium text-gray-700"
          >
            Student ID
          </label>
          <input
            type="text"
            id="student_id"
            name="student_id"
            value={formData.student_id}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
