import React, { useEffect, useState } from "react";
import axios from "axios";

const ViewStudentCTExams = () => {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState("");
  const [ctExams, setCtExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const studentId = localStorage.getItem("userId"); // Logged-in student's ID

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
        displayError("Failed to fetch sessions.");
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const handleSessionChange = async (e) => {
    const sessionId = e.target.value;
    setSelectedSession(sessionId);
    setCtExams([]);
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/student/exam/ct-exams?studentId=${studentId}&sessionId=${sessionId}`
      );
      setCtExams(response.data.exams);
      // displayMessage("CT exams loaded successfully.");
    } catch (err) {
      displayError("Failed to fetch CT exams for the selected session.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && sessions.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      {message && <div className="alert alert-info">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <h2>View CT Exams</h2>

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

      {selectedSession && ctExams.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th>CT Name</th>
              <th>Exam Date</th>
              <th>Duration</th>
              <th>Course Code</th>
              <th>Course Title</th>
              <th>Semester</th>
              <th>Session</th>
              <th>Section</th>
              <th>Teacher</th>
            </tr>
          </thead>
          <tbody>
            {ctExams.map((exam) => (
              <tr key={exam._id}>
                <td>{exam.ctName}</td>
                <td>{new Date(exam.examDate).toLocaleDateString()}</td>
                <td>{exam.duration} mins</td>
                <td>{exam.subject.courseCode}</td>
                <td>{exam.subject.courseTitle}</td>
                <td>{exam.semester.semester}</td>
                <td>{exam.session.name}</td>
                <td>{exam.section.section}</td>
                <td>{exam.teacherId.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : selectedSession ? (
        <p>No CT exams found for the selected session.</p>
      ) : (
        <p>Please select a session to view CT exams.</p>
      )}
    </div>
  );
};

export default ViewStudentCTExams;
