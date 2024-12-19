import React, { useState } from "react";
import { assets } from "../../assets/assets";

const Details = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
    branch: "",
    year: "",
    studentId: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="flex flex-col md:flex-row w-[90%] max-w-4xl rounded-lg overflow-hidden">
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 text-white">
          <div className="text-center">
            <div className=" text-[#56C596] rounded-full w-42 h-42 flex justify-center items-center mx-auto mb-6 shadow-lg">
              <img
                src={assets.Logo}
                alt="Campus Grid Logo"
                className="w-30 h-30"
              />
            </div>
            <h1 className="text-4xl font-bold text-gray-800">Welcome!</h1>
            <p className="mt-4 text-lg text-gray-800">
              Register now to join our community
            </p>
          </div>
        </div>
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Enter Your Details
          </h2>
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-800">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="mt-1 block w-full border-b-2 border-gray-300 focus:border-green-500 focus:outline-none bg-transparent sm:text-sm"
                required
              >
                <option value="student">Student</option>
                <option value="professor">Professor</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full border-b-2 border-gray-300 focus:border-green-500 focus:outline-none bg-transparent sm:text-sm"
                placeholder="Enter your name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full border-b-2 border-gray-300 focus:border-green-500 focus:outline-none bg-transparent sm:text-sm"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full border-b-2 border-gray-300 focus:border-green-500 focus:outline-none bg-transparent sm:text-sm"
                placeholder="Enter your password"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="mt-1 block w-full border-b-2 border-gray-300 focus:border-green-500 focus:outline-none bg-transparent sm:text-sm"
                placeholder="Confirm your password"
                required
              />
            </div>
            {formData.role === "student" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-800">
                    Branch
                  </label>
                  <input
                    type="text"
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    className="mt-1 block w-full border-b-2 border-gray-300 focus:border-green-500 focus:outline-none bg-transparent sm:text-sm"
                    placeholder="Enter your branch"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800">
                    Year
                  </label>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className="mt-1 block w-full border-b-2 border-gray-300 focus:border-green-500 focus:outline-none bg-transparent sm:text-sm"
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
                <div>
                  <label className="block text-sm font-medium text-gray-800">
                    Student ID
                  </label>
                  <input
                    type="text"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleChange}
                    className="mt-1 block w-full border-b-2 border-gray-300 focus:border-green-500 focus:outline-none bg-transparent sm:text-sm"
                    placeholder="Enter your Student ID"
                    required
                  />
                </div>
              </>
            )}
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Details;
