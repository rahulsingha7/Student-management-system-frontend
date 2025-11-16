import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ViewCTExams = () => {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState("");
  const [ctExams, setCtExams] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const displayMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 5000);
  };

  const displayError = (errMsg) => {
    setError(errMsg);
    setTimeout(() => setError(""), 5000);
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
    setCtExams([]);
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const teacherId = localStorage.getItem("userId");
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/teacher/ct-exams?teacherId=${teacherId}&sessionId=${selectedSessionId}`
      );
      setCtExams(response.data);
    } catch (err) {
      displayError("Error fetching CT Exams for the selected session.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this CT Exam?")) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_API_URL}/teacher/ct-exams/${id}`
        );
        displayMessage("CT Exam deleted successfully!");
        setCtExams((prev) => prev.filter((exam) => exam._id !== id));
      } catch (err) {
        displayError("Error deleting CT Exam.");
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      {message && <div className="alert alert-info">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <h2>CT Exams</h2>

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

      {selectedSession && ctExams.length > 0 && (
        <>
          <Link to="/teacher/create-ct-exam" className="btn btn-primary mb-3">
            Create CT Exam
          </Link>
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
                <th>Actions</th>
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
                  <td>
                    <Link
                      to={`/teacher/edit-ct-exam/${exam._id}`}
                      className="btn btn-primary me-3"
                    >
                      Edit
                    </Link>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(exam._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default ViewCTExams;
