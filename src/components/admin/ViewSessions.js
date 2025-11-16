/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ViewSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, [search]); // Fetch sessions whenever the search term changes

  const fetchSessions = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/admin/sessions?search=${search}`
      );
      setSessions(response.data);
      setLoading(false);
    } catch (error) {
      displayError(error.message || "An error occurred while fetching sessions.");
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this session?"
    );
    if (!isConfirmed) return; // If the user cancels, stop here.

    try {
      await axios.delete(`http://localhost:5000/admin/sessions/${id}`);
      setSessions(sessions.filter((session) => session._id !== id)); // Update local state after deletion
    } catch (error) {
      displayError(error.message || "An error occurred while deleting the session.");
    }
  };

  if (loading) {
    return <div>Loading Sessions...</div>;
  }


  const displayError = (errMsg) => {
    setError(errMsg);
    setTimeout(() => setError(""), 5000); // Clear after 2 seconds
  };
  return (
    <div className="container">
      {message && <div className="alert alert-info">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <h2>Sessions</h2>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search sessions by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <Link to="/admin/create-session" className="btn btn-primary mb-3">
        Create Session
      </Link>
      <table className="table">
        <thead>
          <tr>
            <th>Serial No.</th>
            <th>Session Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((session, index) => (
            <tr key={session._id}>
              <td>{index + 1}</td>
              <td>{session.name}</td>
              <td>
                <Link
                  to={`/admin/edit-session/${session._id}`}
                  className="btn btn-primary me-3"
                >
                  Edit
                </Link>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(session._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewSessions;
