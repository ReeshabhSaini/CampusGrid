import React, { useState, useContext, useEffect } from "react";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { assets } from "../../assets/assets";
import defaultImage from "../../assets/DefProfilePic.png";
import { toast } from "react-toastify";

const ProfilePicture = ({ src, alt }) => (
  <img
    src={src || defaultImage}
    alt={alt}
    className="w-32 h-32 rounded-full object-cover"
  />
);

// const CoursesList = ({ courses }) => (
//   <div className="bg-yellow-50 shadow-md rounded-lg p-4 border border-gray-300 w-full mx-auto">
//     <h3 className="text-2xl font-bold mb-4 text-center">Courses</h3>
//     <ul className="list-disc list-inside space-y-2">
//       {courses.map((course, index) => (
//         <li key={index} className="text-lg text-gray-800">
//           {course}
//         </li>
//       ))}
//     </ul>
//   </div>
// );

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

const EditProfileModal = ({ studentData, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    first_name: studentData.first_name || "",
    last_name: studentData.last_name || "",
    email: studentData.email || "",
    branch: studentData.branch || "",
    semester: studentData.semester || "",
    student_id: studentData.student_id || "",
    class_group: studentData.class_group || "",
    tutorial_group: studentData.tutorial_group || "",
    lab_group: studentData.lab_group || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div
        className="p-6 rounded-lg w-1/2 shadow-md flex flex-col"
        style={{ backgroundColor: "#f7ffcc" }}
      >
        <h3 className="text-2xl font-bold mb-4">Edit Profile</h3>
        <div className="overflow-y-auto max-h-96 px-2 mb-4">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="first_name"
                className="block text-sm font-medium text-indigo-600"
              >
                First Name
              </label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="w-full p-3 border rounded-md"
              />
            </div>
            <div>
              <label
                htmlFor="last_name"
                className="block text-sm font-medium text-indigo-600"
              >
                Last Name
              </label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="w-full p-3 border rounded-md"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-indigo-600"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border rounded-md"
              />
            </div>
            {/* Branch */}
            <div>
              <label className="block mb-2 text-sm font-medium text-indigo-600 text-left">
                Branch
              </label>
              <select
                name="branch"
                onChange={handleChange}
                value={formData.branch}
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
                <option value="Prod">
                  Production and Industrial Engineering
                </option>
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
                value={formData.class_group}
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
                value={formData.tutorial_group}
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
                value={formData.lab_group}
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
            <div>
              <label
                htmlFor="student_id"
                className="block text-sm font-medium text-indigo-600"
              >
                Student ID
              </label>
              <input
                type="text"
                id="student_id"
                name="student_id"
                value={formData.student_id}
                onChange={handleChange}
                className="w-full p-3 border rounded-md"
              />
            </div>
          </form>
        </div>
        {/* Buttons */}
        <div className="flex justify-between mt-4 border-t pt-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            onClick={handleSubmit}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

const Profile = () => {
  const { studentData, url } = useContext(StoreContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSubmitProfileUpdate = async (formData) => {
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
        toast.success(response.data.message);
        closeModal();
        window.location.reload(); // Reload the page to reflect the changes
      } else {
        alert(response.data.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Error submitting profile update:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="p-6 w-full relative">
      <button
        onClick={openModal}
        className="absolute top-6 right-6 bg-blue-500 text-white px-6 py-2 rounded-lg text-lg hover:bg-blue-600 focus:outline-none shadow-md"
      >
        Edit Profile
      </button>
      <h2 className="text-3xl font-bold mb-6 text-left">Profile Section</h2>
      <div className="bg-gradient-to-r from-yellow-200 to-green-200 shadow-md rounded-lg p-6 flex flex-col items-center space-y-6 border border-gray-300 w-full">
        <div className="flex items-center space-x-6 w-full">
          <ProfilePicture
            src="https://www.w3schools.com/w3images/avatar2.png"
            alt="Profile"
          />
          <div className="text-left border border-gray-300 rounded-lg p-4 shadow-md bg-yellow-50 w-full">
            <p className="text-lg font-normal text-gray-800">
              <strong>Name:</strong> {studentData.first_name}{" "}
              {studentData.last_name}
            </p>
            <p className="text-lg font-normal text-gray-800">
              <strong>Email:</strong> {studentData.email}
            </p>
            <p className="text-lg font-normal text-gray-800">
              <strong>Branch:</strong> {studentData.branch}
            </p>
            <p className="text-lg font-normal text-gray-800">
              <strong>Semester:</strong> {studentData.semester}
            </p>
            <p className="text-lg font-normal text-gray-800">
              <strong>Class Group:</strong> {studentData.class_group}
            </p>
            <p className="text-lg font-normal text-gray-800">
              <strong>Tutorial Group:</strong> {studentData.tutorial_group}
            </p>
            <p className="text-lg font-normal text-gray-800">
              <strong>Lab Group:</strong> {studentData.lab_group}
            </p>
            <p className="text-lg font-normal text-gray-800">
              <strong>Student ID:</strong> {studentData.student_id}
            </p>
          </div>
        </div>
        {/* <CoursesList courses={studentData.courses || []} /> */}
      </div>

      {isModalOpen && (
        <EditProfileModal
          studentData={studentData}
          onClose={closeModal}
          onSubmit={handleSubmitProfileUpdate}
        />
      )}
    </div>
  );
};

export default Profile;
