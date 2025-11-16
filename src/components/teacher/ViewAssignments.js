import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ViewAssignments = () => {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState("");
  const [assignments, setAssignments] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const displayMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 5000); // Clear after 2 seconds
  };

  const displayError = (errMsg) => {
    setError(errMsg);
    setTimeout(() => setError(""), 5000); // Clear after 2 seconds
  };
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/admin/sessions`
        );
        setSessions(response.data);
      } catch (err) {
        displayError("Error fetching sessions.");
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const handleSessionChange = async (e) => {
    const selectedSessionId = e.target.value;
    setSelectedSession(selectedSessionId);
    setAssignments([]);
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const teacherId = localStorage.getItem("userId"); // Retrieve teacherId from local storage
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/teacher/assignments?teacherId=${teacherId}&sessionId=${selectedSessionId}`
      );
      setAssignments(response.data);
    } catch (err) {
      setError("Error fetching assignments for the selected session.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_API_URL}/teacher/assignments/${id}`
        );
        displayMessage("Assignment deleted successfully!");
        // Refresh the assignment list
        setAssignments((prev) =>
          prev.filter((assignment) => assignment._id !== id)
        );
      } catch (err) {
        displayError("Error deleting assignment.");
      }
    }
  };

  if (loading) {
    return <div>Loading Assignments...</div>;
  }

  return (
    <div className="container">
      {message && <div className="alert alert-info">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <h2>Assignments</h2>

      <div className="form-group mb-4">
        <label>Select Session:</label>
        <select
          className="form-control"
          value={selectedSession}
          onChange={handleSessionChange}
        >
          <option value="">-- Select Session --</option>
          {sessions.map((session) => (
            <option key={session._id} value={session._id}>
              {session.name}
            </option>
          ))}
        </select>
      </div>

      {selectedSession && assignments.length > 0 && (
        <>
          <Link
            to="/teacher/create-assignment"
            className="btn btn-primary mb-3"
          >
            Create Assignment
          </Link>
          <table className="table">
            <thead>
              <tr>
                <th>Session</th>
                <th>Semester</th>
                <th>Section</th>
                <th>Title</th>
                <th>Description</th>
                <th>Due Date</th>
                <th>Course Code</th>
                <th>Course Title</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {assignments.length > 0 ? (
                assignments.map((assignment) => (
                  <tr key={assignment._id}>
                    <td>{assignment.session.name}</td>
                    <td>{assignment.semester.semester}</td>
                    <td>{assignment.section.section}</td>
                    <td>{assignment.title}</td>
                    <td>{assignment.description}</td>
                    <td>{new Date(assignment.dueDate).toLocaleDateString()}</td>
                    <td>{assignment.courseCode}</td>
                    <td>{assignment.courseTitle}</td>
                    <td>
                      <Link
                        to={`/teacher/edit-assignment/${assignment._id}`}
                        className="btn btn-primary me-3"
                      >
                        Edit
                      </Link>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(assignment._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9">
                    No assignments found for the selected session.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default ViewAssignments;
