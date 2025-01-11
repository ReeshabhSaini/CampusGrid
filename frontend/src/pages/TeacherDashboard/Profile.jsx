import React, { useState, useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { assets } from "../../assets/assets";

const ProfilePicture = ({ src, alt }) => {
  const defaultProfileImage = assets.DefProfilePic; 
  const imageSrc = src ? src : defaultProfileImage;

  return (
    <div className="flex-shrink-0">
      <img
        src={imageSrc}
        alt={alt}
        className="w-48 h-48 rounded-full object-cover shadow-lg border-4 border-indigo-300"
      />
    </div>
  );
};

const CoursesList = ({ courses }) => (
  <div className="bg-yellow-100 shadow-lg rounded-lg p-4 border border-gray-300 w-3/4 mx-auto">
    <h3 className="text-2xl font-bold mb-4 text-center text-indigo-600">Courses</h3>
    <ul className="list-disc list-inside space-y-2">
      {courses.map((course, index) => (
        <li key={index} className="text-lg text-gray-800">
          {course}
        </li>
      ))}
    </ul>
  </div>
);

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

const EditProfileModal = ({ professorData, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    first_name: professorData.first_name || "",
    last_name: professorData.last_name || "",
    email: professorData.email || "",
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
      <div className="p-6 rounded-lg w-1/2 shadow-lg bg-yellow-50">
        <h3 className="text-2xl font-bold mb-4 text-indigo-600">Edit Profile</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div> <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Profile = () => {
  const { professorData, url } = useContext(StoreContext);
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
        `${url}/api/auth/professor/update-profile`,
        { ...formData, id }
      );
  
      if (response.data.status) {
        alert("Profile updated successfully!");
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
    <div className="p-6 w-full relative ">
      <button
        onClick={openModal}
        className="absolute top-6 right-6 bg-blue-500 text-white px-6 py-2 rounded-lg text-lg hover:bg-blue-600 focus:outline-none shadow-md transition duration-200"
      >
        Edit Profile
      </button>
      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-600">Profile Section</h2>
      <div className="shadow-lg rounded-lg p-6 flex flex-col items-center space-y-6 border border-gray-300 w-3/4 mx-auto bg-green-50">
        <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-6 w-full ">
          <ProfilePicture src="https://t3.ftcdn.net/jpg/03/45/75/94/360_F_345759488_gh3cxWU7DEnZJCmDiggHnsuM2zqpkTpG.jpg" alt="Profile" />
          <div className="w-full md:w-3/4 text-left border border-gray-300 rounded-lg p-6 shadow-md bg-yellow-50">
            <p className="text-lg font-normal text-gray-800">
              <strong>Name:</strong> {professorData.first_name} {professorData.last_name}
            </p>
            <p className="text-lg font-normal text-gray-800">
              <strong>Email:</strong> {professorData.email}
            </p>
          </div>
        </div>
        <CoursesList courses={professorData.courses || []} />
      </div>

      {isModalOpen && (
        <EditProfileModal
          professorData={professorData}
          onClose={closeModal}
          onSubmit={handleSubmitProfileUpdate}
        />
      )}
    </div>
  );
};

export default Profile;