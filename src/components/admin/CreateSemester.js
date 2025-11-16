import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateSemester = () => {
  const [semester, setSemester] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!semester) {
      setError("Please enter a valid semester number (1-8).");
      return;
    }
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/admin/semesters`, {
        semester,
      });
      displayMessage("Semester created successfully!");
      navigate("/admin/view-semesters"); // Redirect to View Semesters
    } catch (error) {
      console.error(error);
      displayError(error.response.data.message || "Failed to create semester");
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
      <h2>Create Semester</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Semester (1-8):</label>
          <input
            type="number"
            className="form-control"
            min="1"
            max="8"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          Create Semester
        </button>
      </form>
    </div>
  );
};

export default CreateSemester;
