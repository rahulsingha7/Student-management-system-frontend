/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ViewMarks = () => {
  const { gradeId } = useParams();
  const [gradeDetails, setGradeDetails] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const displayError = (errMsg) => {
    setError(errMsg);
    setTimeout(() => setError(""), 5000); // Clear after 2 seconds
  };
  useEffect(() => {
    const fetchGradeDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/student/grade/details/${gradeId}`
        );
        setGradeDetails(response.data);
      } catch (err) {
        displayError("Error fetching grade details.");
      } finally {
        setLoading(false);
      }
    };

    fetchGradeDetails();
  }, [gradeId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container">
      <h2>View Marks</h2>
      {gradeDetails && (
        <>
          <p>Student ID: {gradeDetails.studentId.studentId}</p>
          <p>Student Name: {gradeDetails.studentId.name}</p>
          <p>Session: {gradeDetails.session.name}</p>

          <h3>Course Details</h3>
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
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{gradeDetails.subject.courseCode}</td>
                <td>{gradeDetails.subject.courseTitle}</td>
                <td>{gradeDetails.semester.semester}</td>
                <td>{gradeDetails.section.section}</td>
                <td>{gradeDetails.attendance}</td>
                <td>{gradeDetails.assignment}</td>
                <td>{gradeDetails.ctMarks}</td>
                <td>{gradeDetails.midTerm}</td>
                <td>{gradeDetails.finalExam}</td>
                <td>{gradeDetails.totalMarks}</td>
                <td>{gradeDetails.letterGrade}</td>
                <td>{gradeDetails.grade}</td>
              </tr>
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default ViewMarks;
