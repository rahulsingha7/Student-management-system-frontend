// src/components/admin/EditAdmin.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  useEffect(() => {
    fetchAdminData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAdminData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/admin/${id}`
      );
      setAdminData({
        name: response.data.name,
        email: response.data.email,
        password: "",
      });
    } catch (error) {
      console.error("Error fetching admin data:", error);
      displayError("Error fetching admin data");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdminData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/admin/edit/${id}`, adminData);
      displayMessage("Admin Details Update Successfully");
      navigate("/admin/view-admins"); // Redirect to admin list after update
    } catch (error) {
      displayError("Failed to update admin.");
      console.error("Error updating admin:", error);
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
      <h2>Edit Admin</h2>

      <form onSubmit={handleFormSubmit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={adminData.name}
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
            value={adminData.email}
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
            value={adminData.password}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          Update Admin
        </button>
      </form>
    </div>
  );
};

export default EditAdmin;
