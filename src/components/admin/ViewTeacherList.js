/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ViewTeacherList = () => {
  const [teachers, setTeachers] = useState([]);
  const [search, setSearch] = useState("");
 const[message,setMessage] = useState("");
 const [error,setError] = useState("");
 const [loading,setLoading] = useState(true);
  useEffect(() => {
    fetchTeachers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const fetchTeachers = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/teacher/list?search=${search}`
      );
      setTeachers(response.data);
      setLoading(false);
    } catch (error) {
      displayError("Error fetching teachers:", error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this teacher?"))
      return;

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/teacher/delete/${id}`);
      fetchTeachers(); // Refresh list
    } catch (error) {
    displayError("Error deleting teacher:", error);
    }
  };
if(loading){
  return <div>Loading...</div>;
}

  const displayError = (errMsg) => {
    setError(errMsg);
    setTimeout(() => setError(""), 5000); // Clear after 2 seconds
  };
  return (
    <div className="container">
      {message && <div className="alert alert-info">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <h2>Teacher List</h2>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search teachers by name, ID, or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Serial No.</th>
            <th>Name</th>
            <th>Teacher ID</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map((teacher, index) => (
            <tr key={teacher._id}>
              <td>{index + 1}</td>
              <td>{teacher.name}</td>
              <td>{teacher.teacherId}</td>
              <td>{teacher.email}</td>
              <td>
                <Link
                  to={`/admin/edit-teacher/${teacher._id}`}
                  className="btn btn-primary me-3"
                >
                  Edit
                </Link>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(teacher._id)}
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

export default ViewTeacherList;
