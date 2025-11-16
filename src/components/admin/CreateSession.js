import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateSession = () => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/admin/sessions`, {
        name,
      });
      displayMessage("Session created successfully!");
      navigate("/admin/view-sessions"); // Redirect to View Sessions
    } catch (error) {
      console.error(error);
      displayError(error.response.data.message || "Failed to create session");
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
    <div className="container">
      {message && <div className="alert alert-info">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <h2>Create Session</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Session Name:</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          Create Session
        </button>
      </form>
    </div>
  );
};

export default CreateSession;
