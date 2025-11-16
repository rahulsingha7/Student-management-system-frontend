import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ViewOverallResult = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [loading,setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch students with their overall GPA
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/admin/results/overall-results"
        );
        setStudents(response.data);
        setFilteredStudents(response.data);
        setLoading(false);
      } catch (error) {
        displayError("Failed to fetch overall results.");
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  // Handle search input to filter students by ID or name
  const handleSearch = (term) => {
    setSearchTerm(term);
    const lowercasedTerm = term.toLowerCase();
    const filteredData = students.filter(
      (student) =>
        student.studentId1.toLowerCase().includes(lowercasedTerm) ||
        student.studentName.toLowerCase().includes(lowercasedTerm)
    );
    setFilteredStudents(filteredData);
  };
 if(loading){
  return <div>Loading...</div>
 }
  const displayError = (errMsg) => {
    setError(errMsg);
    setTimeout(() => setError(""), 5000); // Clear after 2 seconds
  };
  return (
    <div className="container">
      {error && <div className="alert alert-danger">{error}</div>}
      <h2>View Overall Results</h2>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by Student ID or Name"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {filteredStudents.length > 0 ? (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Student Name</th>
              <th>Overall GPA</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.studentId}>
                <td>{student.studentId1}</td>
                <td>{student.studentName}</td>
                <td>{student.overallGpa}</td>
                <td>
                  <button
                    className="btn btn-secondary"
                    onClick={() =>
                      navigate(
                        `/admin/view-semesterwise-result/${student.studentId}`
                      )
                    }
                  >
                    View Semesterwise Result
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
};

export default ViewOverallResult;
