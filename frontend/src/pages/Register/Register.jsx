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
    const name = event.target.name;
    const value = event.target.value;

    setFormData((formData) => ({ ...formData, [name]: value }));
  };

  return (
    <div class="flex flex-col md:flex-row items-center justify-start min-h-screen bg-cover bg-no-repeat bg-local">
      <div className="w-full max-w-md p-8 bg-white bg-opacity-15 rounded-lg ml-10">
        <h1 className="text-2xl font-bold text-center text-indigo-600 mb-6">
          Create a New Account
        </h1>
        <form>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-indigo-600">
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
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-indigo-600">
              First Name
            </label>
            <input
              type="name"
              placeholder="First Name"
              onChange={handleChange}
              value={formData.first_name}
              required
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-300 focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-indigo-600">
              Last Name
            </label>
            <input
              type="name"
              placeholder="Last Name"
              onChange={handleChange}
              value={formData.last_name}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-300 focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-indigo-600">
              Email
            </label>
            <input
              type="email"
              onChange={handleChange}
              value={formData.email}
              placeholder="username@pec.edu.in"
              required
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-300 focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-indigo-600">
              Password
            </label>
            <input
              type="password"
              onChange={handleChange}
              value={formData.password}
              placeholder="Password"
              required
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-300 focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-indigo-600">
              Confirm Password
            </label>
            <input
              type="password"
              onChange={handleChange}
              value={formData.confirmPassword}
              placeholder="Confirm Password"
              required
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-300 focus:outline-none"
            />
          </div>
          {formData.role === "student" && (
            <>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-indigo-600">
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
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-indigo-600">
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
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-indigo-600">
                  Student ID
                </label>
                <input
                  type="text"
                  name="studentId"
                  onChange={handleChange}
                  value={formData.studentId}
                  className="w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-300 focus:outline-none"
                  placeholder="Enter your Student ID"
                  required
                />
              </div>
            </>
          )}
          <button
            type="submit"
            className="w-full py-3 mb-4 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            Register
          </button>
          <div className="text-right mb-4">
            <a
              href="#"
              className="text-sm text-indigo-600 font-medium hover:underline"
            >
              Forgot Password?
            </a>
          </div>
          <div className="text-center text-sm text-indigo-600 mb-4">
            or continue with
          </div>
          <button
            type="button"
            className="flex items-center justify-center w-full py-3 mb-4 text-black bg-white rounded-lg hover:bg-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-black-300"
          >
            Sign in with Google
          </button>
          <div className="text-center text-sm text-indigo-600">
            Already have an account yet?{" "}
            <a href="/" className="font-medium hover:underline">
              Login
            </a>
          </div>
        </form>
        <div className="absolute bottom-20 right-20 w-40 h-40 mr-10">
          <img src={assets.Logo} alt="Campus Grid Logo" className="ml-10" />
          <p className="font-sans mt-3 text-4xl font-extrabold ">
            <span className="text-green-700">Campus</span>
            &nbsp;
            <span className="text-gray-600">Grid</span>
          </p>
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-contain bg-no-repeat bg-right">
          <img src={assets.StartImage} alt="Campus Grid Start Up image" />
        </div>
      </div>
    </div>
  );
};

export default Register;
