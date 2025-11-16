/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ViewSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch sessions on initial render
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const sessionResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/admin/sessions`
        );
        setSessions(sessionResponse.data);
      } catch (error) {
        displayError("Failed to fetch sessions.");
      }
    };

    fetchSessions();
  }, []);

  // Fetch subjects whenever the selected session or search query changes
  useEffect(() => {
    if (selectedSession) {
      fetchSubjects();
    }
  }, [selectedSession, search]);

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/admin/subjects?sessionId=${selectedSession}&search=${search}`
      );
      setSubjects(response.data);
      // displayMessage("Subjects loaded successfully.");
    } catch (error) {
      displayError("Failed to fetch subjects.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this subject?")) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/admin/subjects/${id}`);
        setSubjects(subjects.filter((subject) => subject._id !== id));
        displayMessage("Subject deleted successfully!");
      } catch (error) {
        displayError("Failed to delete subject.");
      }
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

      <h2>Subjects</h2>

      {/* Session Filter */}
      <div className="filters mb-3">
        <select
          className="form-select mb-3"
          value={selectedSession}
          onChange={(e) => setSelectedSession(e.target.value)}
        >
          <option value="">Select a Session</option>
          {sessions.map((session) => (
            <option key={session._id} value={session._id}>
              {session.name}
            </option>
          ))}
        </select>
      </div>

      {/* Show Search Input Only When a Session is Selected */}
      {selectedSession && (
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by course code or title"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      )}

      {/* Create Subject Button */}
      {selectedSession && (
        <Link to="/admin/create-subject" className="btn btn-primary mb-3">
          Create Subject
        </Link>
      )}

      {/* Loading Indicator */}
      {loading ? (
        <div>Loading Subjects...</div>
      ) : selectedSession && subjects.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th>Course Code</th>
              <th>Course Title</th>
              <th>Semester</th>
              <th>Session</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((subject) => (
              <tr key={subject._id}>
                <td>{subject.courseCode}</td>
                <td>{subject.courseTitle}</td>
                <td>{subject.semester.semester}</td>
                <td>{subject.session.name}</td>
                <td>
                  <Link
                    to={`/admin/edit-subject/${subject._id}`}
                    className="btn btn-primary me-3"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(subject._id)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : selectedSession ? (
        <div>No subjects found for the selected session.</div>
      ) : (
        <div>Please select a session to view subjects.</div>
      )}
    </div>
  );
};

export default ViewSubjects;
