/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ViewClassSchedule.css";

const ViewClassSchedule = () => {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState("");
  const [teacherSchedule, setTeacherSchedule] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const teacherId = localStorage.getItem("userId"); // Assuming teacherId is stored in local storage

  // Fetch sessions on component mount
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/admin/sessions`
        );
        setSessions(response.data);
      } catch (err) {
        displayError("Failed to fetch sessions.");
      }
    };
    fetchSessions();
  }, []);

  // Fetch schedules when session changes
  const handleSessionChange = async (e) => {
    const sessionId = e.target.value;
    setSelectedSession(sessionId);
    setTeacherSchedule({});
    setLoading(true);

    if (!sessionId) return;

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/admin/teacher-schedule/single-teacher-schedule`,
        { params: { teacherId, sessionId } }
      );

      // Group schedules by day
      const groupedSchedules = {};
      const daysOfWeek = [
        "Saturday",
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
      ];

      daysOfWeek.forEach((day) => {
        groupedSchedules[day] = [];
      });

      response.data.forEach((schedule) => {
        if (groupedSchedules[schedule.day]) {
          groupedSchedules[schedule.day].push(schedule);
        }
      });

      setTeacherSchedule(groupedSchedules);
    } catch (err) {
      displayError("Failed to fetch schedules for the selected session.");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format time
  const formatTime = (time) => {
    const [hour, minute] = time.split(":");
    const hourInt = parseInt(hour, 10);
    const ampm = hourInt >= 12 ? "PM" : "AM";
    const formattedHour = hourInt % 12 || 12;
    return `${formattedHour}:${minute} ${ampm}`;
  };

  const displayError = (errMsg) => {
    setError(errMsg);
    setTimeout(() => setError(""), 5000); // Clear error after 5 seconds
  };

  return (
    <div className="container">
      {error && <div className="alert alert-danger">{error}</div>}
      <h2>Class Schedule</h2>

      {/* Session Dropdown */}
      <div className="mb-3">
        <label>Select Session</label>
        <select
          className="form-control"
          value={selectedSession}
          onChange={handleSessionChange}
        >
          <option value="">-- Select Session --</option>
          {sessions.map((session) => (
            <option key={session._id} value={session._id}>
              {session.name}
            </option>
          ))}
        </select>
      </div>

      {/* Show schedule grouped by day */}
      {loading ? (
        <div>Loading Class Schedule...</div>
      ) : (
        selectedSession &&
        Object.keys(teacherSchedule).length > 0 && (
          <div>
            {Object.keys(teacherSchedule).map((day) => (
              <div key={day}>
                <h3>{day}</h3>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Session</th>
                      <th>Semester</th>
                      <th>Section</th>
                      <th>Course Code</th>
                      <th>Course Title</th>
                      <th>Start Time</th>
                      <th>End Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teacherSchedule[day].length > 0 ? (
                      teacherSchedule[day].map((schedule) => (
                        <tr key={schedule._id}>
                          <td>{schedule.session?.name || "N/A"}</td>
                          <td>{schedule.semester?.semester || "N/A"}</td>
                          <td>{schedule.section?.section || "N/A"}</td>
                          <td>{schedule.subject?.courseCode || "N/A"}</td>
                          <td>{schedule.subject?.courseTitle || "N/A"}</td>
                          <td>{formatTime(schedule.startTime)}</td>
                          <td>{formatTime(schedule.endTime)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7">No classes scheduled for this day.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default ViewClassSchedule;
