import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateSection = () => {
  const [section, setSection] = useState("");
  const [semesters, setSemesters] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedSession, setSelectedSession] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch semesters and sessions
    const fetchSemestersAndSessions = async () => {
      try {
        const semesterResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/admin/semesters`
        );
        const sessionResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/admin/sessions`
        );

        setSemesters(semesterResponse.data);
        setSessions(sessionResponse.data);
      } catch (error) {
        setError("Failed to fetch semesters and sessions:", error);
      }
    };
    fetchSemestersAndSessions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!section || !selectedSemester || !selectedSession) {
      setError("Please fill out all fields.");
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/admin/sections`, {
        section,
        semesterId: selectedSemester,
        sessionId: selectedSession,
      });
      displayMessage("Section created successfully!");
      navigate("/admin/view-sections");
    } catch (error) {
      console.error(error);
      displayError(error.response.data.message || "Failed to create section");
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
      <h2>Create Section</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Section:</label>
          <input
            type="text"
            className="form-control"
            value={section}
            onChange={(e) => setSection(e.target.value.toUpperCase())}
            required
          />
        </div>

        <div className="form-group">
          <label>Semester:</label>
          <select
            className="form-control"
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            required
          >
            <option value="">Select Semester</option>
            {semesters.map((sem) => (
              <option key={sem._id} value={sem._id}>
                {sem.semester}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Session:</label>
          <select
            className="form-control"
            value={selectedSession}
            onChange={(e) => setSelectedSession(e.target.value)}
            required
          >
            <option value="">Select Session</option>
            {sessions.map((sess) => (
              <option key={sess._id} value={sess._id}>
                {sess.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-primary mt-3">
          Create Section
        </button>
      </form>
    </div>
  );
};

export default CreateSection;
