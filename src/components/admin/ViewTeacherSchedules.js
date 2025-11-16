/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ViewTeacherSchedules = () => {
  const [teacherSchedules, setTeacherSchedules] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedSession, setSelectedSession] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    if (selectedSession) {
      fetchTeacherSchedules();
    } else {
      setTeacherSchedules([]);
    }
  }, [selectedSession, search]);

  const fetchTeacherSchedules = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/admin/teacher-schedule?search=${search}&session=${selectedSession}`
      );
      setTeacherSchedules(response.data);
      // displayMessage("Teacher schedules loaded successfully.");
    } catch (error) {
      console.error("Failed to fetch teacher schedules", error);
      displayError("Error fetching teacher schedules. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/admin/sessions");
      setSessions(response.data);
      // displayMessage("Sessions loaded successfully.");
    } catch (error) {
      console.error("Failed to fetch sessions", error);
      displayError("Error fetching sessions. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (time) => {
    const [hour, minute] = time.split(":");
    const hourInt = parseInt(hour, 10);
    const ampm = hourInt >= 12 ? "PM" : "AM";
    const formattedHour = hourInt % 12 || 12;
    return `${formattedHour}:${minute} ${ampm}`;
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this schedule?")) {
      try {
        await axios.delete(
          `http://localhost:5000/admin/teacher-schedule/${id}`
        );
        setTeacherSchedules(
          teacherSchedules.filter((schedule) => schedule._id !== id)
        );
        displayMessage("Teacher schedule deleted successfully!");
      } catch (error) {
        console.error("Failed to delete teacher schedule", error);
        displayError("Failed to delete Teacher Schedule. Please try again.");
      }
    }
  };

  const displayMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 5000); // Clear after 5 seconds
  };

  const displayError = (errMsg) => {
    setError(errMsg);
    setTimeout(() => setError(""), 5000); // Clear after 5 seconds
  };

  return (
    <div className="container">
      {message && <div className="alert alert-info">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <h2>Teacher Schedules</h2>

      {/* Session Dropdown */}
      <div className="mb-3">
        <label>Select Session:</label>
        <select
          className="form-control"
          value={selectedSession}
          onChange={(e) => setSelectedSession(e.target.value)}
        >
          <option value="">-- Select Session --</option>
          {sessions.map((session) => (
            <option key={session._id} value={session._id}>
              {session.name}
            </option>
          ))}
        </select>
      </div>

      {/* Search Input */}
      {selectedSession && (
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by teacher name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      )}

      {/* Create Schedule Button */}
      <Link
        to="/admin/create-teacher-schedule"
        className="btn btn-primary mb-3"
      >
        Create Teacher Schedule
      </Link>

      {/* Loading Indicator */}
      {loading ? (
        <div>Loading schedules...</div>
      ) : selectedSession ? (
        teacherSchedules.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Teacher</th>
                <th>Session</th>
                <th>Semester</th>
                <th>Section</th>
                <th>Course Code</th>
                <th>Course Title</th>
                <th>Day</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teacherSchedules.map((schedule) => (
                <tr key={schedule._id}>
                  <td>{schedule.teacherId?.name || "N/A"}</td>
                  <td>{schedule.session?.name || "N/A"}</td>
                  <td>{schedule.semester?.semester || "N/A"}</td>
                  <td>{schedule.section?.section || "N/A"}</td>
                  <td>{schedule.subject?.courseCode || "N/A"}</td>
                  <td>{schedule.subject?.courseTitle || "N/A"}</td>
                  <td>{schedule.day}</td>
                  <td>{formatTime(schedule.startTime)}</td>
                  <td>{formatTime(schedule.endTime)}</td>
                  <td>
                    <Link
                      to={`/admin/edit-teacher-schedule/${schedule._id}`}
                      className="btn btn-primary me-3"
                    >
                      Edit
                    </Link>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(schedule._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div>No schedules found for the selected session.</div>
        )
      ) : (
        <div>Please select a session to view schedules.</div>
      )}
    </div>
  );
};

export default ViewTeacherSchedules;
