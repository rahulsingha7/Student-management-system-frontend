import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const AdminGradeDetails = () => {
  const { studentId, sessionId } = useParams();
  const navigate = useNavigate();
  const [studentDetails, setStudentDetails] = useState({});
  const [grades, setGrades] = useState([]);
  const [gpa, setGpa] = useState(0);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [Loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchGradeDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/admin/results/details/${studentId}/${sessionId}`
        );

        const { studentId1, studentName, session, gpa, grades } = response.data;

        setStudentDetails({ studentId1, studentName, session });
        setGpa(gpa);
        setGrades(grades);
        setLoading(false);
      } catch (error) {
        displayError("Failed to fetch grade details.");
        setLoading(false);
        // setMessage("");
      }
    };

    fetchGradeDetails();
  }, [studentId, sessionId]);

  const handleEdit = (gradeId) => {
    navigate(`/admin/edit-grade/${gradeId}`);
  };

  const handleDelete = async (gradeId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this grade?"
    );

    if (confirmDelete) {
      try {
        const response = await axios.delete(
          `${process.env.REACT_APP_API_URL}/admin/results/delete-grade/${gradeId}`
        );

        if (response.status === 200) {
          // Remove the deleted grade from the list
          const updatedGrades = grades.filter((grade) => grade._id !== gradeId);
          setGrades(updatedGrades);

          // Recalculate GPA based on the updated grades
          const totalGradePoints = updatedGrades.reduce(
            (sum, grade) => sum + parseFloat(grade.grade || 0),
            0
          );
          const updatedGpa = updatedGrades.length
            ? (totalGradePoints / updatedGrades.length).toFixed(2)
            : "N/A";
          setGpa(updatedGpa);

          displayMessage("Grade deleted successfully.");
          // setError("");
        }
      } catch (error) {
        displayError("Failed to delete grade.");
        // setMessage("");
      }
    }
  };
  if (Loading) {
    return <div>Loading...... </div>;
  }
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
      <h2>Student Grade Details</h2>
      <div>
        <p>Student ID: {studentDetails.studentId1}</p>
        <p>Student Name: {studentDetails.studentName}</p>
        <p>Session: {studentDetails.session}</p>
        <p>Obtained GPA: {gpa}</p>
      </div>
      <h3>Grades</h3>
      {grades.length > 0 ? (
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
              <th>Marks</th>
              <th>Letter Grade</th>
              <th>Grade</th>
              <th>Teacher</th>
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
                <td>{grade.attendance}</td>
                <td>{grade.assignment}</td>
                <td>{grade.ctMarks}</td>
                <td>{grade.midTerm}</td>
                <td>{grade.finalExam}</td>
                <td>{grade.totalMarks}</td>
                <td>{grade.letterGrade}</td>
                <td>{grade.grade}</td>
                <td>{grade.teacherId.name}</td>
                <td>
                  <button
                    className="btn btn-primary me-2 my-2"
                    onClick={() => handleEdit(grade._id)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(grade._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No grades found.</p>
      )}
    </div>
  );
};

export default AdminGradeDetails;
