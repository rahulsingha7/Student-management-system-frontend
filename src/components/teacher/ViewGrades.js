import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const ViewGrades = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { studentId, studentId1, studentName, session } = state || {};
  const teacherId = localStorage.getItem("userId");
  const [error, setError] = useState("");
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const displayError = (errMsg) => {
    setError(errMsg);
    setTimeout(() => setError(""), 5000); // Clear after 2 seconds
  };
  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/teacher/results/view-grades`,
          { params: { teacherId, studentId, subjectId: state.subjectId } } // Include subjectId here
        );
        setGrades(response.data);
        setLoading(false);
      } catch (error) {
        displayError("Error fetching grades.");
        setLoading(false);
      }
    };

    fetchGrades();
  }, [teacherId, studentId, state.subjectId]);

  const handleDelete = async (resultId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this grade? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/teacher/results/delete-grade`,
        {
          data: { resultId },
        }
      );
      // Update the grades array after deleting
      setGrades((prevGrades) =>
        prevGrades.filter((grade) => grade.resultId !== resultId)
      );
    } catch (error) {
      displayError("Error deleting grade.");
    }
  };

  const sessionFromApi = grades.length > 0 ? grades[0].session : session;

  if (loading) {
    return <div>Loading Grades...</div>;
  }

  if (grades.length === 0) {
    return (
      <div>
        <h3>View Grades</h3>
        <div>
          <p>
            <b>Session:</b> {sessionFromApi || "Session not available"}
          </p>
          <p>
            <b>Student ID:</b> {studentId1}
          </p>
          <p>
            <b>Student Name:</b> {studentName}
          </p>
        </div>
        <div className="alert alert-info">
          No grades available for this student.
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {error && <div className="alert alert-danger">{error}</div>}

      <h3>View Grades</h3>
      <div>
        <p>
          <b>Session:</b> {sessionFromApi || "Session not available"}
        </p>
        <p>
          <b>Student ID:</b> {studentId1}
        </p>
        <p>
          <b>Student Name:</b> {studentName}
        </p>
      </div>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Course Code</th>
            <th>Course Title</th>
            <th>Semester</th>
            <th>Section</th>
            <th>Attendance</th>
            <th>Assignment</th>
            <th>CT Exam</th>
            <th>Mid Term</th>
            <th>Final Exam</th>
            <th>Total</th>
            <th>Grade</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {grades.map((grade) => (
            <tr key={grade.resultId}>
              <td>{grade.courseCode}</td>
              <td>{grade.courseTitle}</td>
              <td>{grade.semester}</td>
              <td>{grade.section}</td>
              <td>{grade.attendance}</td>
              <td>{grade.assignment}</td>
              <td>{grade.ctMarks}</td>
              <td>{grade.midTerm}</td>
              <td>{grade.finalExam}</td>
              <td>{grade.totalMarks}</td>
              <td>{grade.letterGrade}</td>
              <td>
                <button
                  onClick={() =>
                    navigate("/teacher/edit-grade", {
                      state: { resultId: grade.resultId },
                    })
                  }
                  className="btn btn-primary me-3"
                >
                  Edit
                </button>

                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(grade.resultId)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewGrades;
