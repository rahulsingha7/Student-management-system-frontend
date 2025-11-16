import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const EditGrade = () => {
  const navigate = useNavigate();
  const { state } = useLocation(); // Retrieve state data
  const { resultId } = state; // Extract resultId

  const [attendance, setAttendance] = useState(0);
  const [assignment, setAssignment] = useState(0);
  const [ctMarks, setCtMarks] = useState(0);
  const [midTerm, setMidTerm] = useState(0);
  const [finalExam, setFinalExam] = useState(0);
  const [studentName, setStudentName] = useState("");
  const [studentId1, setStudentId1] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Fetch existing grade data using resultId
  useEffect(() => {
    const fetchGrade = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/teacher/results/edit-grade",
          { params: { resultId } }
        );

        const {
          attendance,
          assignment,
          ctMarks,
          midTerm,
          finalExam,
          studentName,
          studentId1,
        } = response.data;

        setAttendance(attendance || 0);
        setAssignment(assignment || 0);
        setCtMarks(ctMarks || 0);
        setMidTerm(midTerm || 0);
        setFinalExam(finalExam || 0);
        setStudentName(studentName || "N/A");
        setStudentId1(studentId1 || "N/A");
      } catch (error) {
        displayError("Failed to fetch grade data.");
        console.error("Error fetching grade data:", error);
      }
    };

    fetchGrade();
  }, [resultId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/teacher/results/update-grade", {
        resultId,
        attendance,
        assignment,
        ctMarks,
        midTerm,
        finalExam,
      });

      displayMessage("Grade updated successfully.");
      setError("");
      navigate(-1); // Go back to the previous page
    } catch (error) {
      displayError("Error updating grade.");
      console.error("Error updating grade:", error);
      setMessage("");
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
      <h3>Edit Grade</h3>
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
          Update Grade
        </button>
      </form>
    </div>
  );
};

export default EditGrade;
