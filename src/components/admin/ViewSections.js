/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const ViewSections = () => {
  const [sections, setSections] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch available sessions
    const fetchSessions = async () => {
      try {
        const sessionResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/admin/sessions`
        );
        setSessions(sessionResponse.data);
      } catch (error) {
        console.error(error);
        displayError("Failed to fetch sessions.");
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const fetchSections = async () => {
    if (!selectedSession) {
      setSections([]);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/admin/sections?sessionId=${selectedSession}&search=${search}`
      );
      setSections(response.data);
      // displayMessage("Sections loaded successfully.");
    } catch (error) {
      console.error(error);
      displayError("Failed to fetch sections.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch sections when session or search changes
    fetchSections();
  }, [selectedSession, search]);

  const handleEdit = (id) => {
    navigate(`/admin/edit-section/${id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this section?")) {
      return;
    }

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/admin/sections/${id}`);
      setSections(sections.filter((section) => section._id !== id));
      displayMessage("Section deleted successfully!");
    } catch (error) {
      console.error(error);
      displayError("Failed to delete section.");
    }
  };

  const displayMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 5000); // Clear after 5 seconds
  };

  const displayError = (errMsg) => {
    setError(errMsg);
    setTimeout(() => setError(""), 5000); // Clear after 5 seconds
  };

  return (
    <div className="container">
      {message && <div className="alert alert-info">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <h2>View Sections</h2>

      {/* Session Selector */}
      <div className="filters mb-3">
        <label>Select Session:</label>
        <select
          className="form-select mb-3"
          value={selectedSession}
          onChange={(e) => setSelectedSession(e.target.value)}
        >
          <option value="">-- Select Session --</option>
          {sessions.map((session) => (
            <option key={session._id} value={session._id}>
              {session.name}
            </option>
          ))}
        </select>
      </div>

      {/* Search Input */}
      {selectedSession && (
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by section name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      )}

      {/* Create Section Button */}
      <Link to="/admin/create-section" className="btn btn-primary mb-3">
        Create Section
      </Link>

      {/* Sections Table */}
      {loading ? (
        <div>Loading Sections...</div>
      ) : selectedSession ? (
        sections.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Session</th>
                <th>Semester</th>
                <th>Section</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sections.map((section) => (
                <tr key={section._id}>
                  <td>{section.session.name}</td>
                  <td>{section.semester.semester}</td>
                  <td>{section.section}</td>
                  <td>
                    <button
                      className="btn btn-primary me-3"
                      onClick={() => handleEdit(section._id)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(section._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div>No sections found for the selected session.</div>
        )
      ) : (
        <div>Please select a session to view sections.</div>
      )}
    </div>
  );
};

export default ViewSections;
