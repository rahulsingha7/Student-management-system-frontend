/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditSession = () => {
  const { id } = useParams(); // Get the session ID from the URL parameters
  const [sessionName, setSessionName] = useState("");
  const [error,setError] = useState("");
  const [message,setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/admin/sessions/${id}`
        );
        setSessionName(response.data.name);
      } catch (error) {
        displayError(error);
      }
    };
    fetchSession();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/admin/sessions/${id}`, {
        name: sessionName,
      });
      navigate("/admin/view-sessions"); // Redirect to the sessions page after updating
    } catch (error) {
      console.error(error);
      displayError(error.response.data.message || "Failed to update session");
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
      <h2>Edit Session</h2>
      <form onSubmit={handleUpdate}>
        <div className="mb-3">
          <label htmlFor="sessionName" className="form-label">
            Session Name
          </label>
          <input
            type="text"
            className="form-control"
            id="sessionName"
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          Update Session
        </button>
      </form>
    </div>
  );
};

export default EditSession;
