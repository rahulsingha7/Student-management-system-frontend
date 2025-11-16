import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState({
    name: "",
    studentId: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  useEffect(() => {
    fetchStudentData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchStudentData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/student/${id}`);
      setStudentData({
        name: response.data.name,
        studentId: response.data.studentId,
        email: response.data.email,
        password: "",
      });
    } catch (error) {
      console.error("Error fetching student data:", error);
      displayError("Error fetching student data");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudentData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/student/edit/${id}`, studentData);
      displayMessage("Studen Details Updated Successfully");
      navigate("/admin/view-students"); // Redirect to student list after update
    } catch (error) {
      displayError("Failed to update student.");
      console.error("Error updating student:", error);
    }
  };
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
      <h2>Edit Student</h2>
   
      <form onSubmit={handleFormSubmit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={studentData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Student ID</label>
          <input
            type="text"
            className="form-control"
            name="studentId"
            value={studentData.studentId}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={studentData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">New Password (optional)</label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={studentData.password}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          Update Student
        </button>
      </form>
    </div>
  );
};

export default EditStudent;
