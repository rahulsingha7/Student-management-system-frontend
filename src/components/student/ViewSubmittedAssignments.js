import React, { useState, useEffect } from "react";
import axios from "axios";

const ViewSubmittedAssignments = () => {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState("");
  const [submittedAssignments, setSubmittedAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
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
          "http://localhost:5000/admin/sessions"
        );
        setSessions(response.data);
      } catch (err) {
        displayError("Error fetching sessions.");
      }
    };

    fetchSessions();
  }, []);

  const handleSessionChange = async (e) => {
    const sessionId = e.target.value;
    setSelectedSession(sessionId);
    setSubmittedAssignments([]);
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const studentId = localStorage.getItem("userId");
      const response = await axios.get(
        `http://localhost:5000/student/assignments/submitted/${studentId}?sessionId=${sessionId}`
      );
      setSubmittedAssignments(response.data.submissions);
    } catch (err) {
      displayError(
        "Error fetching submitted assignments for the selected session."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (submissionId) => {
    if (!window.confirm("Are you sure you want to delete this submission?"))
      return;

    try {
      await axios.delete(
        `http://localhost:5000/student/assignments/delete/${submissionId}`
      );
      setSubmittedAssignments((prev) =>
        prev.filter((submission) => submission._id !== submissionId)
      );
      displayMessage("Submission deleted successfully.");
    } catch (err) {
      displayError("Failed to delete submission.");
    }
  };

  if (loading && sessions.length === 0) return <div>Loading...</div>;

  return (
    <div className="container">
      {message && <div className="alert alert-info">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <h2>View Submitted Assignments</h2>

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

      {selectedSession && submittedAssignments.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th>Course Code</th>
              <th>Course Title</th>
              <th>Title</th>
              <th>Submitted At</th>
              <th>Marks</th>
              <th>Feedback</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {submittedAssignments.map((submission) => (
              <tr key={submission._id}>
                <td>{submission.assignment.courseCode}</td>
                <td>{submission.assignment.courseTitle}</td>
                <td>{submission.assignment.title}</td>
                <td>{new Date(submission.submittedAt).toLocaleString()}</td>
                <td>{submission.marks || "Not graded yet"}</td>
                <td>{submission.feedback || "No feedback yet"}</td>
                <td>
                  <a
                    href={`http://localhost:5000/${submission.file}`}
                    download={submission.assignment.title}
                    className="btn btn-secondary me-2"
                  >
                    Download
                  </a>
                  <button
                    onClick={() => handleDelete(submission._id)}
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
        <p>No submitted assignments found for this session.</p>
      ) : (
        <p>Please select a session to view submitted assignments.</p>
      )}
    </div>
  );
};

export default ViewSubmittedAssignments;
