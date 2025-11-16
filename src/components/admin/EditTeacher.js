/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditTeacher = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [teacherData, setTeacherData] = useState({
    name: "",
    teacherId: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [message,setMessage] = useState("");
  useEffect(() => {
    fetchTeacherData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTeacherData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/teacher/${id}`);
      setTeacherData({
        name: response.data.name,
        teacherId: response.data.teacherId,
        email: response.data.email,
        password: "",
      });
    } catch (error) {
      console.error("Error fetching teacher data:", error);
      displayError("Error fetching teacher data");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTeacherData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/teacher/edit/${id}`, teacherData);
      navigate("/admin/view-teachers"); // Redirect to teacher list after update
    } catch (error) {
      displayError("Failed to update teacher.");
      console.error("Error updating teacher:", error);
    }
  };


  const displayError = (errMsg) => {
    setError(errMsg);
    setTimeout(() => setError(""), 5000); // Clear after 2 seconds
  };
  return (
    <div className="container">
         {message && <div className="alert alert-info">{message}</div>}
         {error && <div className="alert alert-danger">{error}</div>}
      <h2>Edit Teacher</h2>
      <form onSubmit={handleFormSubmit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={teacherData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Teacher ID</label>
          <input
            type="text"
            className="form-control"
            name="teacherId"
            value={teacherData.teacherId}
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
            value={teacherData.email}
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
            value={teacherData.password}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          Update Teacher
        </button>
      </form>
    </div>
  );
};

export default EditTeacher;
