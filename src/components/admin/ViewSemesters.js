/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ViewSemesters = () => {
  const [semesters, setSemesters] = useState([]);
  const [error,setError] = useState("");
  const [message,setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/admin/semesters`
        );
        setSemesters(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching semesters:", error);
        displayError("Failed to load semesters. Please check the server.");
        setLoading(false);
      }
    };
    fetchSemesters();
  }, []);

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this semester?"
    );
    if (!isConfirmed) return;

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/admin/semesters/${id}`);
      setSemesters(semesters.filter((semester) => semester._id !== id)); // Update local state after deletion
    } catch (error) {
      displayError(error);
    }
  };
  if (loading) {
    return <div>Loading Semesters...</div>;
  }


  const displayError = (errMsg) => {
    setError(errMsg);
    setTimeout(() => setError(""), 5000); // Clear after 2 seconds
  };
  return (
    <div className="container">
         {message && <div className="alert alert-info">{message}</div>}
         {error && <div className="alert alert-danger">{error}</div>}
      <h2>Semesters</h2>
      <Link to="/admin/create-semester" className="btn btn-primary mb-3">
        Create Semester
      </Link>
      <table className="table">
        <thead>
          <tr>
            <th>Serial No.</th>
            <th>Semester</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {semesters.map((semester, index) => (
            <tr key={semester._id}>
              <td>{index + 1}</td>
              <td>{semester.semester}</td>
              <td>
                <Link
                  to={`/admin/edit-semester/${semester._id}`}
                  className="btn btn-primary me-3"
                >
                  Edit
                </Link>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(semester._id)}
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

export default ViewSemesters;
