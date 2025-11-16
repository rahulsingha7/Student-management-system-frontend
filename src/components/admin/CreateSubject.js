import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateSubject = () => {
  const [courseCode, setCourseCode] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [semesterId, setSemesterId] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [semesters, setSemesters] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/admin/sessions`
        );
        const semesterResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/admin/semesters`
        );
        setSessions(sessionResponse.data);
        setSemesters(semesterResponse.data);
      } catch (error) {
        setError("Failed to fetch sessions or semesters");
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/admin/subjects`, {
        courseCode,
        courseTitle,
        semesterId,
        sessionId,
      });
      displayMessage("Subject created successfully!");
      navigate("/admin/view-subjects");
    } catch (error) {
      displayError(error.response?.data?.message || "Failed to create subject");
    }
  };
  const displayMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 5000); // Clear after 2 seconds
  };

  const displayError = (errMsg) => {
    setError(errMsg);
    setTimeout(() => setError(""), 5000); // Clear after 2 seconds
  };
  return (
    <div className="container">
      {message && <div className="alert alert-info">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <h2>Create Subject</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Course Code:</label>
          <input
            type="text"
            className="form-control"
            value={courseCode}
            onChange={(e) => setCourseCode(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Course Title:</label>
          <input
            type="text"
            className="form-control"
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Semester:</label>
          <select
            className="form-control"
            value={semesterId}
            onChange={(e) => setSemesterId(e.target.value)}
            required
          >
            <option value="">Select Semester</option>
            {semesters.map((semester) => (
              <option key={semester._id} value={semester._id}>
                {semester.semester}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Session:</label>
          <select
            className="form-control"
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value)}
            required
          >
            <option value="">Select Session</option>
            {sessions.map((session) => (
              <option key={session._id} value={session._id}>
                {session.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          Create Subject
        </button>
      </form>
    </div>
  );
};

export default CreateSubject;
