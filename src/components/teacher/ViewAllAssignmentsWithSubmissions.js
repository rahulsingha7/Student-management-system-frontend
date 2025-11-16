// components/ViewAllAssignmentsWithSubmission.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ViewAllAssignmentsWithSubmission = () => {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState("");
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const displayMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 5000); // Clear after 2 seconds
  };

  const displayError = (errMsg) => {
    setError(errMsg);
    setTimeout(() => setError(""), 5000); // Clear after 2 seconds
  };
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/admin/sessions"
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
    setAssignments([]);
    // setMessage("");
    // setError("");
    setLoading(true);

    try {
      const teacherId = localStorage.getItem("userId"); // Retrieve teacherId from local storage
      const response = await axios.get(
        `http://localhost:5000/teacher/assignments/submissions?teacherId=${teacherId}&sessionId=${selectedSessionId}`
      );
      if (response.data.assignments.length === 0) {
        displayError(
          "No assignments created by this teacher in the selected session."
        );
      } else {
        setAssignments(response.data.assignments);
      }
    } catch (err) {
      displayError("Failed to fetch assignments with submissions.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (file) => {
    if (file) {
      window.open(`http://localhost:5000/${file}`, "_blank");
    } else {
      displayError("No file submitted.");
    }
  };

  const handleDelete = async (submissionId) => {
    if (window.confirm("Are you sure you want to delete this submission?")) {
      try {
        await axios.delete(
          `http://localhost:5000/student/assignments/delete/${submissionId}`
        );
        displayMessage("Submission deleted successfully.");
        // Optionally update state after deletion
        setAssignments((prev) =>
          prev.map((assignment) => ({
            ...assignment,
            submissions: assignment.submissions.filter(
              (submission) => submission.submissionId !== submissionId
            ),
          }))
        );
      } catch (error) {
        displayError("Failed to delete submission.");
      }
    }
  };

  const handleGiveMarks = (submissionId) => {
    navigate(
      `/teacher/grade-assignments?submissionId=${submissionId}&type=marks`
    );
  };

  if (loading) {
    return <div>Loading Submitted Assignments...</div>;
  }

  return (
    <div className="container">
      {message && <div className="alert alert-info">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <h2>All Assignments with Submissions</h2>

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

      {selectedSession && assignments.length > 0 && (
        <>
          {assignments.map((assignment) => (
            <div key={assignment.assignmentTitle}>
              <h3>{assignment.assignmentTitle}</h3>
              <table className="table">
                <thead>
                  <tr>
                    <th>Student ID</th>
                    <th>Student Name</th>
                    <th>Semester</th>
                    <th>Section</th>
                    <th>Course Code</th>
                    <th>Course Title</th>
                    <th>Title</th>
                    <th>Due Date</th>
                    <th>Submitted At</th>
                    <th>Marks</th>
                    <th>Feedback</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assignment.submissions.map((submission) => (
                    <tr key={submission.studentId}>
                      <td>{submission.studentId}</td>
                      <td>{submission.studentName}</td>
                      <td>{submission.semester}</td>
                      <td>{submission.section}</td>
                      <td>{submission.courseCode}</td>
                      <td>{submission.courseTitle}</td>
                      <td>{submission.title}</td>
                      <td>
                        {new Date(submission.dueDate).toLocaleDateString()}
                      </td>
                      <td>
                        {submission.submittedAt === "Not submitted yet"
                          ? "Not submitted yet"
                          : new Date(submission.submittedAt).toLocaleString()}
                      </td>
                      <td>{submission.marks}</td>
                      <td>{submission.feedback}</td>
                      <td>
                        {submission.submittedAt !== "Not submitted yet" && (
                          <>
                            <button
                              onClick={() => handleDownload(submission.file)}
                              className="btn btn-secondary me-2 my-2"
                            >
                              Download
                            </button>
                            <button
                              onClick={() =>
                                handleDelete(submission.submissionId)
                              }
                              className="btn btn-danger me-2"
                            >
                              Delete
                            </button>
                            <button
                              onClick={() =>
                                handleGiveMarks(submission.submissionId)
                              }
                              className="btn btn-primary me-2"
                            >
                              Give Marks
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default ViewAllAssignmentsWithSubmission;
