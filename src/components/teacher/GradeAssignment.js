import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const GradeAssignment = () => {
  const [marks, setMarks] = useState("");
  const [feedback, setFeedback] = useState("");
  const [submissionData, setSubmissionData] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const submissionId = params.get("submissionId");

    if (!submissionId) {
      displayError("No submission ID provided.");
      return;
    }

    const fetchSubmissionDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/teacher/assignments/submissions/${submissionId}`
        );
        if (response.data) {
          setSubmissionData(response.data);
          setMarks(response.data.marks || "Not provided yet");
          setFeedback(response.data.feedback || "Not provided yet");
        }
      } catch (error) {
        displayError("Failed to fetch submission details.");
      }
    };

    fetchSubmissionDetails();
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submissionId = new URLSearchParams(location.search).get(
        "submissionId"
      );

      await axios.put(
        `${process.env.REACT_APP_API_URL}/teacher/assignments/submissions/${submissionId}`,
        {
          marks: marks === "Not provided yet" ? "" : marks,
          feedback: feedback === "Not provided yet" ? "" : feedback,
        }
      );

      navigate("/teacher/view-submitted-assignments"); // Redirect after submitting
    } catch (error) {
      displayError("Failed to update marks and feedback.");
    }
  };

  const displayError = (errMsg) => {
    setError(errMsg);
    setTimeout(() => setError(""), 5000); // Clear after 2 seconds
  };
  return (
    <div className="container">
      {error && <div className="alert alert-danger">{error}</div>}
      <h2>Grade Assignment</h2>
      {submissionData ? (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Student ID:</label>
            <input
              type="text"
              className="form-control"
              value={submissionData.studentId}
              readOnly
            />
          </div>
          <div className="form-group">
            <label>Student Name:</label>
            <input
              type="text"
              className="form-control"
              value={submissionData.studentName}
              readOnly
            />
          </div>
          <div className="form-group">
            <label>Semester:</label>
            <input
              type="text"
              className="form-control"
              value={submissionData.semester.semester}
              readOnly
            />
          </div>
          <div className="form-group">
            <label>Section:</label>
            <input
              type="text"
              className="form-control"
              value={submissionData.section.section}
              readOnly
            />
          </div>
          <div className="form-group">
            <label>Course Code:</label>
            <input
              type="text"
              className="form-control"
              value={submissionData.courseCode}
              readOnly
            />
          </div>
          <div className="form-group">
            <label>Course Title:</label>
            <input
              type="text"
              className="form-control"
              value={submissionData.courseTitle}
              readOnly
            />
          </div>
          <div className="form-group">
            <label>Title:</label>
            <input
              type="text"
              className="form-control"
              value={submissionData.title}
              readOnly
            />
          </div>
          <div className="form-group">
            <label>Marks:</label>
            <input
              type="number"
              className="form-control"
              value={marks}
              onChange={(e) => setMarks(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Feedback:</label>
            <textarea
              className="form-control"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary mt-3">
            Submit Marks and Feedback
          </button>
        </form>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default GradeAssignment;
