/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ViewAdminList = () => {
  const [admins, setAdmins] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchAdmins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const fetchAdmins = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/admin/list?search=${search}`
      );
      setAdmins(response.data);
      setLoading(false);
    } catch (error) {
      displayError("Error fetching admins:", error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/admin/delete/${id}`);
      fetchAdmins(); // Refresh list
    } catch (error) {
      displayError("Error deleting admin:", error);
    }
  };
  if (loading) {
    return <div>Loading..... </div>;
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
      <h2>Admin List</h2>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search admins"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Serial No.</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin, index) => (
            <tr key={admin._id}>
              <td>{index + 1}</td>
              <td>{admin.name}</td>
              <td>{admin.email}</td>
              <td>
                <Link
                  to={`/admin/edit-admin/${admin._id}`}
                  className="btn btn-primary me-3"
                >
                  Edit
                </Link>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(admin._id)}
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

export default ViewAdminList;
