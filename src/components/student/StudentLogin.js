import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const StudentLogin = () => {
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/student/login", {
        studentId,
        password,
      });
      // Store both token and role in localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", response.data.user.name);
      localStorage.setItem("userId", response.data.user._id);
      localStorage.setItem("studentId", response.data.user.studentId);
      localStorage.setItem("email", response.data.user.email);
      localStorage.setItem("role", "student");

      displayError("");

      // Clear the fields and navigate to student dashboard
      setStudentId("");
      setPassword("");
      navigate("/student/dashboard");
    } catch (err) {
      displayError(err.response?.data?.message || "Login failed");
    }
  };

  const displayError = (errMsg) => {
    setError(errMsg);
    setTimeout(() => setError(""), 5000); // Clear after 2 seconds
  };

  return (
    <div className="container mt-5">
      <h2>Student Login</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label htmlFor="studentId" className="form-label">
            Student ID
          </label>
          <input
            type="text"
            className="form-control"
            id="studentId"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>
      <p className="mt-3">
        Haven't registered yet? <Link to="/student/register">Register</Link>
      </p>
    </div>
  );
};

export default StudentLogin;
