import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ViewSemesterWiseResult = () => {
  const { studentId } = useParams();
  const [studentData, setStudentData] = useState({});
  const [semesterResults, setSemesterResults] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    const fetchSemesterWiseResult = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/admin/results/semesterwise/${studentId}`
        );
        const { student, overallGpa, semesters } = response.data;

        setStudentData({
          studentId: student.studentId,
          studentName: student.name,
          overallGpa,
        });
        setSemesterResults(semesters);
        setLoading(false); // Data successfully loaded
      } catch (error) {
        displayError("Failed to fetch semester-wise results.");
        setLoading(false); // Loading complete even if there's an error
      }
    };

    fetchSemesterWiseResult();
  }, [studentId]);

  // Show loading spinner or message
  if (loading) {
    return <div>Loading...</div>;
  }
  const displayError = (errMsg) => {
    setError(errMsg);
    setTimeout(() => setError(""), 5000); // Clear after 2 seconds
  };
  // Show error if the API call fails
  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container">
      <h2>Semester-Wise Results</h2>

      <div>
        <strong>Student ID:</strong> {studentData.studentId}
      </div>
      <div>
        <strong>Student Name:</strong> {studentData.studentName}
      </div>
      <div>
        <strong>Overall GPA:</strong> {studentData.overallGpa}
      </div>

      {semesterResults && semesterResults.length > 0 ? (
        semesterResults.map((semester) => (
          <div key={semester.semester} className="mb-4">
            <h4>Semester: {semester.semester}</h4>
            <div>
              <strong>Obtained GPA:</strong> {semester.semesterGpa}
            </div>
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
        ))
      ) : (
        <div>No semester results available.</div>
      )}
    </div>
  );
};

export default ViewSemesterWiseResult;
