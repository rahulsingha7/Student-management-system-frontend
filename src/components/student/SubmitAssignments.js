import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SubmitAssignments = () => {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState("");
  const [assignments, setAssignments] = useState([]);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const displayMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 5000); // Clear after 5 seconds
  };

  const displayError = (errMsg) => {
    setError(errMsg);
    setTimeout(() => setError(""), 5000); // Clear after 5 seconds
  };

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/admin/sessions`
        );
        setSessions(response.data);
      } catch (error) {
        displayError("Error fetching sessions.");
      }
    };

    fetchSessions();
  }, []);

  // Automatically fetch assignments when session is selected
  useEffect(() => {
    if (!selectedSession) return;

    const fetchAssignments = async () => {
      setLoading(true);
      setAssignments([]);
      setError("");

      try {
        const studentId = localStorage.getItem("userId");
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/student/assignments?studentId=${studentId}&sessionId=${selectedSession}`
        );
        setAssignments(response.data.assignments);
      } catch (error) {
        displayError("No assignments available for the selected session.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [selectedSession]); // This effect runs whenever selectedSession changes

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (assignmentId) => {
    if (!selectedFile) {
      displayError("Please select a file to submit.");
      return;
    }

    const formData = new FormData();
    formData.append("assignmentFile", selectedFile);
    formData.append("assignmentId", assignmentId);
    formData.append("studentId", localStorage.getItem("userId"));

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/student/assignments/submit`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      displayMessage("Assignment submitted successfully!");
      navigate(`/student/view-submitted/${assignmentId}`);
    } catch (error) {
      displayError(
        error.response?.data?.message || "Error submitting assignment."
      );
    }
  };

  return (
    <div className="container">
      {message && <div className="alert alert-info">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <h2>Submit Assignments</h2>

      <div className="form-group mb-4">
        <label>Select Session:</label>
        <select
          className="form-control"
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

      {loading ? (
        <div>Loading assignments...</div>
      ) : (
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
              <th>Teacher</th>
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
                  <td>{assignment.teacherId.name}</td>
                  <td>
                    {assignment.isSubmitted ? (
                      <span>Already Submitted</span>
                    ) : (
                      <>
                        <input type="file" onChange={handleFileChange} />
                        <button
                          className="btn btn-primary"
                          onClick={() => handleSubmit(assignment._id)}
                        >
                          Submit Assignment
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10">
                  No assignments found for the selected session.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SubmitAssignments;
