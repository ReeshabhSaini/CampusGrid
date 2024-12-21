import React, { useState } from "react";
import { assets } from "../../assets/assets";

const Register = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
    branch: "",
    year: "",
    studentId: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // Add API call logic to submit formData here
    console.log("Form submitted", formData);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-cover bg-no-repeat bg-local">
      <div className="w-full max-w-md p-8 bg-opacity-90 rounded-lg ml-5">
        <h1 className="text-2xl font-bold text-center text-indigo-600 mb-6">
          Create a New Account
        </h1>
        <form onSubmit={handleSubmit}>
          {/* Role */}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-indigo-600 text-left">
              Role
            </label>
            <select
              name="role"
              onChange={handleChange}
              value={formData.role}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-300 focus:outline-none"
              required
            >
              <option value="student">Student</option>
              <option value="professor">Professor</option>
            </select>
          </div>

          {/* First Name */}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-indigo-600 text-left">
              First Name
            </label>
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              onChange={handleChange}
              value={formData.first_name}
              required
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-300 focus:outline-none"
            />
          </div>

          {/* Last Name */}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-indigo-600 text-left">
              Last Name
            </label>
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              onChange={handleChange}
              value={formData.last_name}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-300 focus:outline-none"
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-indigo-600 text-left">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="username@pec.edu.in"
              onChange={handleChange}
              value={formData.email}
              required
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-300 focus:outline-none"
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-indigo-600 text-left">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              value={formData.password}
              required
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-300 focus:outline-none"
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-indigo-600 text-left">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              onChange={handleChange}
              value={formData.confirmPassword}
              required
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-300 focus:outline-none"
            />
          </div>

          {/* Conditional Student Fields */}
          {formData.role === "student" && (
            <>
              {/* Branch */}
              <div className="mb-4">
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
                  <option value="ECE">Electronics and Communication</option>
                  <option value="EE">Electrical</option>
                </select>
              </div>

              {/* Year */}
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-indigo-600 text-left">
                  Year
                </label>
                <select
                  name="year"
                  onChange={handleChange}
                  value={formData.year}
                  className="w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-300 focus:outline-none"
                  required
                >
                  <option value="" disabled>
                    Select Year
                  </option>
                  <option value="1st">1st</option>
                  <option value="2nd">2nd</option>
                  <option value="3rd">3rd</option>
                  <option value="4th">4th</option>
                </select>
              </div>

              {/* Student ID */}
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-indigo-600 text-left">
                  Student ID
                </label>
                <input
                  type="text"
                  name="studentId"
                  placeholder="Enter your Student ID"
                  onChange={handleChange}
                  value={formData.studentId}
                  required
                  className="w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-300 focus:outline-none"
                />
              </div>
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 mb-4 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            Register
          </button>

          {/* Forgot Password */}
          <div className="text-right mb-4">
            <a
              href="#"
              className="text-sm text-indigo-600 font-medium hover:underline"
            >
              Forgot Password?
            </a>
          </div>

          {/* Login Link */}
          <div className="text-center text-sm text-indigo-600">
            Already have an account?{" "}
            <a href="/" className="font-medium hover:underline">
              Login
            </a>
          </div>
        </form>
      </div>

      {/* Fixed Right Image */}
      <div className="fixed top-0 right-0 w-1/2 h-full bg-contain bg-no-repeat">
        <img src={assets.StartImage} alt="Campus Grid Startup Image" />
      </div>

      {/* Fixed Bottom-Right Logo */}
      <div className="fixed bottom-10 right-10">
        <img src={assets.Logo} alt="Campus Grid Logo" className="w-20" />
        <p className="mt-3 text-4xl font-extrabold text-gray-600">
          <span className="text-green-700">Campus</span> Grid
        </p>
      </div>
    </div>
  );
};

export default Register;
