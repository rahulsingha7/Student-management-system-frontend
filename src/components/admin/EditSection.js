import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditSection = () => {
  const { id } = useParams();
  const [section, setSection] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [semesterId, setSemesterId] = useState("");
  const [sessions, setSessions] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSection = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/admin/sections/${id}`
        );
        const { section, session, semester } = response.data;
        setSection(section);
        setSessionId(session._id);
        setSemesterId(semester._id);
      } catch (error) {
        console.error(error);
        displayError("Failed to fetch section details");
      }
    };

    const fetchSessions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/admin/sessions/"
        );
        setSessions(response.data);
      } catch (error) {
        console.error(error);
        displayError("Failed to fetch sessions");
      }
    };

    const fetchSemesters = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/admin/semesters"
        );
        setSemesters(response.data);
      } catch (error) {
        console.error(error);
        displayError("Failed to fetch semesters");
      }
    };

    fetchSection();
    fetchSessions();
    fetchSemesters();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/admin/sections/${id}`, {
        section,
        sessionId,
        semesterId,
      });
      displayMessage("Section updated successfully!");
      navigate("/admin/view-sections");
    } catch (error) {
      console.error(error);
      displayError(error.response?.data?.message || "Failed to update section");
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
      <h2>Edit Section</h2>
      <form onSubmit={handleSubmit}>
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
          <label>Section:</label>
          <input
            type="text"
            className="form-control"
            value={section}
            onChange={(e) => setSection(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary mt-3">
          Update Section
        </button>
      </form>
    </div>
  );
};

export default EditSection;
