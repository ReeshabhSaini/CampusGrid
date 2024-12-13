import React, { useState } from "react";
import axios from "axios";
import CampusGridLogo from "../assets/Logo.png";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );
      alert("Login Successful!");
      console.log(response.data); // Process the token or user data
    } catch (error) {
      console.error(error);
      alert("Login Failed!");
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-start min-h-screen bg-cover bg-no-repeat bg-local" style={{ backgroundImage: `url('/background_image.png')` }}>
      <div className="w-full max-w-md p-8 bg-white bg-opacity-15 shadow-lg rounded-lg ml-10">
        
        {/* LEFT SECTION */}
        
        {/* Title */}
        <h1 className="text-2xl font-bold text-center text-indigo-600 mb-6">Login</h1>
        
        <form onSubmit={handleLogin}>
          {/* Email input */}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-indigo-600">Email</label>
            <input
              type="email"
              placeholder="username@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-300 focus:outline-none"
            />
          </div>

          {/* Password input */}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-indigo-600">Password</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-300 focus:outline-none"
            />
          </div>

          {/* Forgot password */}
          <div className="text-right mb-4">
            <a href="#" className="text-sm text-indigo-600 hover:underline">Forgot Password?</a>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full py-3 mb-4 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            Sign in
          </button>

          {/* Divider */}
          <div className="text-center text-sm text-indigo-600 mb-4">or continue with</div>
          
          {/*  Google Sign In  */}
          <button
            type="button"
            className="flex items-center justify-center w-full py-3 mb-4 text-black bg-white rounded-lg hover:bg-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-black-300"
          >
            <img
              src={`${process.env.PUBLIC_URL}/google-logo-removebg.png`}
              alt="Google Logo"
              className="w-5 h-5 mr-3"
            />
            Sign in with Google
          </button>

          {/* Register */}
          <div className="text-center text-sm text-indigo-600">
            Don't have an account yet? <a href="./Register" className="font-medium hover:underline">Register</a>
          </div>
        </form>
        
        {/*  Logo  */}
        <div class="absolute bottom-20 right-20 w-40 h-40 mr-10">
          <img src={CampusGridLogo} alt="Campus Grid Logo" className="ml-10" />
          <p className="font-sans mt-3 text-4xl font-extrabold ">
            <span className="text-green-700">Campus</span>
            &nbsp;
            <span className="text-gray-600">Grid</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
