/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ViewStudentGrades = () => {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState("");
  const [studentInfo, setStudentInfo] = useState({});
  const [grades, setGrades] = useState([]);
  const [gpa, setGpa] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const studentId = localStorage.getItem("userId");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
        setError("");
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
    setGrades([]);
    setGpa(0);
    setStudentInfo({});
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/student/grade/${studentId}?sessionId=${selectedSessionId}`
      );

      setStudentInfo(response.data.student);
      setGrades(response.data.grades);
      setGpa(response.data.gpa);
    } catch (err) {
      displayError("Error fetching grades for the selected session.");
    } finally {
      setLoading(false);
    }
  };

  const viewMarks = (gradeId) => {
    navigate(`/student/view-marks/${gradeId}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      {message && <div className="alert alert-info">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <h2>View Grades</h2>

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

      {selectedSession && grades.length > 0 && (
        <div>
          <h3>Student Info</h3>
          <p>Student ID: {studentInfo.studentId}</p>
          <p>Student Name: {studentInfo.name}</p>
          <p>
            Session:{" "}
            {sessions.find((session) => session._id === selectedSession)?.name}
          </p>
          <p>Obtained GPA: {gpa}</p>

          <h3>Results</h3>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Course Code</th>
                <th>Course Title</th>
                <th>Semester</th>
                <th>Section</th>
                <th>Marks</th>
                <th>Letter Grade</th>
                <th>Grade</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {grades.map((grade) => (
                <tr key={grade._id}>
                  <td>{grade.subject.courseCode}</td>
                  <td>{grade.subject.courseTitle}</td>
                  <td>{grade.semester.semester}</td>
                  <td>{grade.section.section}</td>
                  <td>{grade.totalMarks}</td>
                  <td>{grade.letterGrade}</td>
                  <td>{grade.grade}</td>
                  <td>
                    <button
                      onClick={() => viewMarks(grade._id)}
                      className="btn btn-primary"
                    >
                      View Marks
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewStudentGrades;
