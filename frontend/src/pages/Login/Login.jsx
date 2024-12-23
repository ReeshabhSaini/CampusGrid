import React, { useState } from "react";
import axios from "axios";
import { assets } from "../../assets/assets";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:4000/api/auth/login",
        {
          email,
          password,
        }
      );

      // Save token to localStorage
      localStorage.setItem("token", response.data.token);

      alert("Login successful!");
      // Redirect or update UI as needed
    } catch (err) {
      console.error("Error details:", {
        message: err.message,
        response: err.response,
        status: err.response?.status,
        data: err.response?.data,
      });

      setError(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-start min-h-screen bg-cover bg-no-repeat bg-local">
      <div className="w-full max-w-md p-8 bg-white bg-opacity-15 rounded-lg ml-10">
        <h1 className="text-2xl font-bold text-center text-indigo-600 mb-6">
          Login
        </h1>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-indigo-600">
              Email
            </label>
            <input
              type="email"
              placeholder="username@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-300 focus:outline-none"
            />
          </div>
          {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mb-4 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            {loading ? "Logging in..." : "Sign in"}
          </button>
        </form>
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
          Don't have an account yet?{" "}
          <a href="/register" className="font-medium hover:underline">
            Register
          </a>
        </div>
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

export default Login;
