import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css"; // Import custom styles if needed
import "bootstrap/dist/css/bootstrap.min.css";

const AdminDashboard = () => {
  const [statistics, setStatistics] = useState({});

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/statistics`
        );
        setStatistics(response.data);
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };
    fetchStatistics();
  }, []);

  return (
    <div className="container">
      <h2>Admin Dashboard</h2>
      <div className="row">
        <div className="col-md-4 mb-3">
          <div className="card text-center">
            <div className="card-header bg-students">Total Students</div>
            <div className="card-body">
              <h5 className="card-title">{statistics.students}</h5>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card text-center">
            <div className="card-header bg-teachers">Total Teachers</div>
            <div className="card-body">
              <h5 className="card-title">{statistics.teachers}</h5>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card text-center">
            <div className="card-header bg-semesters">Total Semesters</div>
            <div className="card-body">
              <h5 className="card-title">{statistics.semesters}</h5>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card text-center">
            <div className="card-header bg-sections">Total Sections</div>
            <div className="card-body">
              <h5 className="card-title">{statistics.sections}</h5>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card text-center">
            <div className="card-header bg-subjects">Total Subjects</div>
            <div className="card-body">
              <h5 className="card-title">{statistics.subjects}</h5>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card text-center">
            <div className="card-header bg-sessions">Total Sessions</div>
            <div className="card-body">
              <h5 className="card-title">{statistics.sessions}</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
