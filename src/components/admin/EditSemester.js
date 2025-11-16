/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditSemester = () => {
  const { id } = useParams();
  const [semester, setSemester] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSemester = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/admin/semesters/${id}`
        );
        setSemester(response.data.semester);
      } catch (error) {
        displayError(error);
      }
    };
    fetchSemester();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/admin/semesters/${id}`, {
        semester,
      });
      navigate("/admin/view-semester"); // Redirect to View Semesters
    } catch (error) {
      console.error(error);
      displayError(error.response.data.message || "Failed to update semester");
    }
  };


  const displayError = (errMsg) => {
    setError(errMsg);
    setTimeout(() => setError(""), 5000); // Clear after 2 seconds
  };
  return (
    <div className="container">
      {message && <div className="alert alert-info">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <h2>Edit Semester</h2>
      <form onSubmit={handleUpdate}>
        <div className="mb-3">
          <label htmlFor="semester" className="form-label">
            Semester (1-8)
          </label>
          <input
            type="number"
            className="form-control"
            id="semester"
            min="1"
            max="8"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          Update Semester
        </button>
      </form>
    </div>
  );
};

export default EditSemester;
