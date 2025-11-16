import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const GradeStudent = () => {
  const navigate = useNavigate();
  const { state } = useLocation(); // Retrieve state data from navigation
  const {
    studentId,
    studentId1,
    studentName,
    subjectId,
    semesterId,
    sectionId,
    sessionId,
  } = state;

  const [attendance, setAttendance] = useState(0);
  const [assignment, setAssignment] = useState(0);
  const [ctMarks, setCtMarks] = useState(0);
  const [midTerm, setMidTerm] = useState(0);
  const [finalExam, setFinalExam] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const displayMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 5000); // Clear after 2 seconds
  };

  const displayError = (errMsg) => {
    setError(errMsg);
    setTimeout(() => setError(""), 5000); // Clear after 2 seconds
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const teacherId = localStorage.getItem("userId");
      await axios.post("http://localhost:5000/teacher/results/grade-student", {
        teacherId,
        studentId,
        subjectId,
        semesterId,
        sectionId,
        sessionId,
        attendance,
        assignment,
        ctMarks,
        midTerm,
        finalExam,
      });
      displayMessage("Grade submitted successfully.");
      setError("");
      navigate(-1); // Go back to the previous page
    } catch (error) {
      displayError("Error submitting grade:", error);
      setMessage("");
    }
  };

  return (
    <div className="container">
      {message && <div className="alert alert-info">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <h3>Grade Student</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Student ID:</label>
          <input
            type="text"
            value={studentId1}
            readOnly
            className="form-control"
          />
        </div>
        <div>
          <label>Student Name:</label>
          <input
            type="text"
            value={studentName}
            readOnly
            className="form-control"
          />
        </div>
        <div>
          <label>Attendance (0-10):</label>
          <input
            type="number"
            min="0"
            max="10"
            value={attendance}
            onChange={(e) => setAttendance(parseInt(e.target.value))}
            className="form-control"
          />
        </div>
        <div>
          <label>Assignment (0-10):</label>
          <input
            type="number"
            min="0"
            max="10"
            value={assignment}
            onChange={(e) => setAssignment(parseInt(e.target.value))}
            className="form-control"
          />
        </div>
        <div>
          <label>CT-Exam (0-20):</label>
          <input
            type="number"
            min="0"
            max="20"
            value={ctMarks}
            onChange={(e) => setCtMarks(parseInt(e.target.value))}
            className="form-control"
          />
        </div>
        <div>
          <label>Mid-Term (0-20):</label>
          <input
            type="number"
            min="0"
            max="20"
            value={midTerm}
            onChange={(e) => setMidTerm(parseInt(e.target.value))}
            className="form-control"
          />
        </div>
        <div>
          <label>Final Exam (0-40):</label>
          <input
            type="number"
            min="0"
            max="40"
            value={finalExam}
            onChange={(e) => setFinalExam(parseInt(e.target.value))}
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          Submit Grade
        </button>
      </form>
    </div>
  );
};

export default GradeStudent;
