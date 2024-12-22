import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import TDashboard from "./pages/TeacherDashboard/TDashboard";
import ReschedulePage from "./pages/TeacherDashboard/Reschedule";
import SDashboard from "./pages/StudentDashboard/SDashboard";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tdashboard" element={<TDashboard />} />
        <Route path="/sdashboard" element={<SDashboard />} />
        <Route path="/tdashboard/reschedule" element={<ReschedulePage />} />
      </Routes>
    </div>
  );
};

export default App;
