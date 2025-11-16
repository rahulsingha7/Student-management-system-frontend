import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ViewStudentSchedule.css";

const ViewStudentSchedule = () => {
  const [studentSchedule, setStudentSchedule] = useState({});
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState("");
  const studentId = localStorage.getItem("userId");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch available sessions
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

  // Fetch schedule based on the selected session
  const handleSessionChange = async (e) => {
    const sessionId = e.target.value;
    setSelectedSession(sessionId);
    setStudentSchedule({});
    // setError("");
    setLoading(true);

    if (!sessionId) return;

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/student/schedule/class-schedule/${studentId}?sessionId=${sessionId}`
      );
      setStudentSchedule(response.data.schedule);
    } catch (err) {
      displayError("Failed to fetch student schedule.");
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

  const displayError = (errMsg) => {
    setError(errMsg);
    setTimeout(() => setError(""), 5000); // Clear after 2 seconds
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

      {/* Show schedule only if a session is selected and schedule exists */}
      {loading ? (
        <div>Loading Class Schedule...</div>
      ) : (
        selectedSession &&
        Object.keys(studentSchedule).length > 0 && (
          <div>
            {Object.keys(studentSchedule).map((day) => (
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
                      <th>Teacher</th>
                      <th>Start Time</th>
                      <th>End Time</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentSchedule[day].length > 0 ? (
                      studentSchedule[day].map((schedule) => {
                        const hasOverlap =
                          schedule.overlap && schedule.overlap.trim() !== "";
                        return (
                          <tr
                            key={`${schedule.courseCode}-${schedule.section}`}
                            className={
                              hasOverlap ? "table-danger text-white" : ""
                            }
                          >
                            <td>{schedule.session || "N/A"}</td>
                            <td>{schedule.semester || "N/A"}</td>
                            <td>{schedule.section || "N/A"}</td>
                            <td>{schedule.courseCode || "N/A"}</td>
                            <td>{schedule.courseTitle || "N/A"}</td>
                            <td>{schedule.teacher || "N/A"}</td>
                            <td>{formatTime(schedule.startTime)}</td>
                            <td>{formatTime(schedule.endTime)}</td>
                            <td>{schedule.status}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="9">No classes scheduled for this day.</td>
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

export default ViewStudentSchedule;
