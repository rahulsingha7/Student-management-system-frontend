/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import axios from "axios";

const ViewStudentAttendance = () => {
  const studentId = localStorage.getItem("userId");
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState("");
  const [groupedAttendance, setGroupedAttendance] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const displayError = (errMsg) => {
    setError(errMsg);
    setTimeout(() => setError(""), 5000);
  };

  const fetchSessions = async () => {
    try {
      const response = await axios.get("http://localhost:5000/admin/sessions");
      setSessions(response.data);
    } catch (err) {
      displayError("Error fetching sessions.");
    }
  };

  const fetchAttendanceRecords = async (sessionId, query = "") => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/student/attendance", {
        params: { studentId, sessionId, search: query }
      });
      setGroupedAttendance(response.data);
      setError(""); // Clear any previous errors
    } catch (error) {
      displayError("Failed to fetch attendance records.");
      console.error("Error fetching attendance records:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleSessionChange = (e) => {
    const sessionId = e.target.value;
    setSelectedSession(sessionId);
    setGroupedAttendance({});
    setError("");
    setSearchQuery("");
    setLoading(true);

    if (sessionId) {
      fetchAttendanceRecords(sessionId, searchQuery);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (selectedSession) {
      fetchAttendanceRecords(selectedSession, query);
    }
  };

  if (loading && sessions.length === 0) return <div>Loading...</div>;

  return (
    <div className="container">
      {error && <div className="alert alert-danger">{error}</div>}
      <h2>Attendance</h2>

      <div className="form-group mb-4">
        <label>Select Session:</label>
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

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by Course Code or Course Title"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      {Object.keys(groupedAttendance).length === 0 ? (
        <p>No attendance records found for this session.</p>
      ) : (
        Object.entries(groupedAttendance).map(([groupKey, records]) => {
          const [semester, section, session, ...courseParts] =
            groupKey.split("-");
          const courseCode = courseParts.join("-"); // Rejoin the parts of the course code

          return (
            <div key={groupKey} className="mb-5">
              <h3>
                {semester} {section} {session} - {courseCode}
              </h3>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Student ID</th>
                    <th>Student Name</th>
                    <th>Course Title</th>
                    <th>Attendance</th>
                    <th>Teacher Name</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record, index) => (
                    <tr key={index}>
                      <td>{new Date(record.date).toLocaleDateString()}</td>
                      <td>{record.studentId}</td>
                      <td>{record.studentName}</td>
                      <td>{record.courseTitle}</td>
                      <td>{record.attendance}</td>
                      <td>{record.teacherName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })
      )}
    </div>
  );
};

export default ViewStudentAttendance;
