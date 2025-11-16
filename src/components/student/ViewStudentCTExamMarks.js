import React, { useEffect, useState } from "react";
import axios from "axios";

const ViewStudentCTExamMarks = () => {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState("");
  const [marksData, setMarksData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const studentId = localStorage.getItem("userId"); // Logged-in student's ID

  const displayError = (errMsg) => {
    setError(errMsg);
    setTimeout(() => setError(""), 5000);
  };


  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/admin/sessions"
        );
        setSessions(response.data);
      } catch (err) {
        displayError("Failed to fetch sessions.");
      }
    };

    fetchSessions();
  }, []);

  const handleSessionChange = async (e) => {
    const sessionId = e.target.value;
    setSelectedSession(sessionId);
    setMarksData([]);
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await axios.get(
        `http://localhost:5000/student/exam/marks?studentId=${studentId}&sessionId=${sessionId}`
      );
      setMarksData(response.data.marks);
      // displayMessage("CT exam marks loaded successfully.");
    } catch (err) {
      displayError("Failed to fetch marks for the selected session.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      {message && <div className="alert alert-info">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <h2>View CT Exam Marks</h2>

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

      {loading ? (
        <div>Loading CT Exam Marks...</div>
      ) : selectedSession && marksData.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th>CT Name</th>
              <th>Session</th>
              <th>Semester</th>
              <th>Section</th>
              <th>Course Code</th>
              <th>Course Title</th>
              <th>Teacher</th>
              <th>Marks</th>
            </tr>
          </thead>
          <tbody>
            {marksData.map((mark, index) => (
              <tr key={index}>
                <td>{mark.ctName}</td>
                <td>{mark.session}</td>
                <td>{mark.semester}</td>
                <td>{mark.section}</td>
                <td>{mark.courseCode}</td>
                <td>{mark.courseTitle}</td>
                <td>{mark.teacher}</td>
                <td>{mark.marks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : selectedSession ? (
        <p>No marks available for the selected session.</p>
      ) : (
        <p>Please select a session to view CT exam marks.</p>
      )}
    </div>
  );
};

export default ViewStudentCTExamMarks;
