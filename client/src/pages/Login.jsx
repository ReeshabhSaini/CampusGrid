import React, { useState } from "react";
import axios from "axios";

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
    <div className="login-page">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div>Email</div>
        <input
          type="email"
          placeholder="username@pec.edu.in"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div>Password</div>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div>Forgot Password?</div>
        <button type="submit">Sign in</button>
        <div>or continue with</div>
        <button>Sign in with Google</button>
        <div>
          Don't have an account yet? <span>Register</span>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
