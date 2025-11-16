import React, { useState, useEffect } from "react";
import axios from "axios";

const ViewResultsBySemester = () => {
  const [studentInfo, setStudentInfo] = useState({});
  const [semesters, setSemesters] = useState([]);
  const [overallGpa, setOverallGpa] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const studentId = localStorage.getItem("userId");

  const displayError = (errMsg) => {
    setError(errMsg);
    setTimeout(() => setError(""), 5000); // Clear after 2 seconds
  };
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/student/grade/results-by-semester/${studentId}`
        );

        setStudentInfo(response.data.student);
        setOverallGpa(response.data.overallGpa);
        setSemesters(response.data.semesters);
      } catch (err) {
        displayError("Error fetching results by semester.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [studentId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container">
      <h2>Results by Semester</h2>
      <p>
        <strong>Student ID:</strong> {studentInfo.studentId}
      </p>
      <p>
        <strong>Student Name:</strong> {studentInfo.name}
      </p>
      <p>
        <strong>Overall GPA:</strong> {overallGpa}
      </p>

      {semesters.map((semester) => (
        <div key={semester.semester} className="mb-5">
          <h3>Semester: {semester.semester}</h3>
          <p>Obtained GPA: {semester.semesterGpa}</p>
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
              </tr>
            </thead>
            <tbody>
              {semester.grades.map((grade) => (
                <tr key={grade._id}>
                  <td>{grade.subject.courseCode}</td>
                  <td>{grade.subject.courseTitle}</td>
                  <td>{grade.semester.semester}</td>
                  <td>{grade.section.section}</td>
                  <td>{grade.totalMarks}</td>
                  <td>{grade.letterGrade}</td>
                  <td>{grade.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default ViewResultsBySemester;
