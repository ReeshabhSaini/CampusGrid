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
    <div className="login-container">
      <div className="login-box">
  <h1 class="login-subtitle">Login</h1>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="username@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="forgot-password">
            <a href="#">Forgot Password?</a>
          </div>
          <button type="submit" className="btn primary-btn">Sign in</button>
          <div className="alternative">or continue with</div>
          <button type="button" className="btn google-btn">
  <img src= {`${process.env.PUBLIC_URL}/google-logo.png`} alt="Google Logo" />
  Sign in with Google
</button>

          <div className="register">
            Don't have an account yet? <a href="#">Register</a>
          </div>
        </form>
      </div>
      {/* <div className="login-logo">
        <img src={`${process.env.PUBLIC_URL}/logo.jpg`} alt="Campus Grid Logo" />
      </div> */}
    </div>
  );
};

export default LoginPage;
