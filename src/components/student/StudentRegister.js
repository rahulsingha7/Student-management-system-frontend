import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const StudentRegister = () => {
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      displayError("Passwords do not match");
      setPassword("");
      setConfirmPassword("");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/student/register`,
        {
          name,
          studentId,
          email,
          password,
        }
      );
      displayMessage(response.data.message);
      // setError("");

      // Clear fields after successful registration
      setName("");
      setStudentId("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      // Redirect to login page
      setTimeout(() => navigate("/student/login"), 2000);
    } catch (error) {
      // setMessage("");
      displayError(error.response?.data?.message || "Registration failed.");
    }
  };
  const displayMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 5000); // Clear after 2 seconds
  };

  const displayError = (errMsg) => {
    setError(errMsg);
    setTimeout(() => setError(""), 5000); // Clear after 2 seconds
  };
  return (
    <div className="container mt-5">
      <h2>Student Registration</h2>
      {message && <div className="alert alert-info">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Student ID</label>
          <input
            type="text"
            className="form-control"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Confirm Password</label>
          <input
            type="password"
            className="form-control"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Register
        </button>
      </form>
      <p className="mt-3">
        Already registered? <Link to="/student/login">Login</Link>
      </p>
    </div>
  );
};

export default StudentRegister;
