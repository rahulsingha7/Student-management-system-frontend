/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import axios from "axios";

const ViewAttendance = () => {
  const teacherId = localStorage.getItem("userId");
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState("");
  const [groupedAttendance, setGroupedAttendance] = useState({});
  const [filteredAttendance, setFilteredAttendance] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const displayMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 5000);
  };

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
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendanceRecords = async (sessionId) => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:5000/teacher/attendance/view",
        { params: { teacherId, sessionId } }
      );

      setGroupedAttendance(response.data);
      setFilteredAttendance(response.data);
    } catch (error) {
      displayError("Error fetching attendance records.");
    } finally {
      setLoading(false);
    }
  };

  const handleSessionChange = (e) => {
    const selectedSessionId = e.target.value;
    setSelectedSession(selectedSessionId);
    setGroupedAttendance({});
    setFilteredAttendance({});
    if (selectedSessionId) fetchAttendanceRecords(selectedSessionId);
  };

  const handleStatusChange = (groupKey, date, studentId, newStatus) => {
    setFilteredAttendance((prev) => ({
      ...prev,
      [groupKey]: prev[groupKey].map((entry) =>
        entry.date === date
          ? {
              ...entry,
              attendanceRecords: entry.attendanceRecords.map((record) =>
                record.studentId === studentId
                  ? { ...record, status: newStatus }
                  : record
              ),
            }
          : entry
      ),
    }));
  };

  const updateAttendance = async (attendanceId, studentRecordId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/teacher/attendance/update/${attendanceId}`,
        {
          studentRecordId,
          status: newStatus,
        }
      );

      displayMessage("Attendance updated successfully.");
    } catch (error) {
      displayError("Error updating attendance.");
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredAttendance(groupedAttendance);
      return;
    }
    const lowercasedTerm = term.toLowerCase();
    const filteredData = Object.entries(groupedAttendance).reduce(
      (acc, [groupKey, records]) => {
        const filteredRecords = records
          .map((entry) => ({
            ...entry,
            attendanceRecords: entry.attendanceRecords.filter(
              (record) =>
                record.studentId1.includes(lowercasedTerm) ||
                record.studentName.toLowerCase().includes(lowercasedTerm)
            ),
          }))
          .filter((entry) => entry.attendanceRecords.length > 0);

        if (filteredRecords.length > 0) {
          acc[groupKey] = filteredRecords;
        }

        return acc;
      },
      {}
    );

    setFilteredAttendance(filteredData);
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  if (loading) return <div>Loading attendance records...</div>;

  return (
    <div className="container">
      <h2>View and Edit Attendance</h2>
      {message && <div className="alert alert-info">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

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
          placeholder="Search by student ID or name"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {Object.entries(filteredAttendance).map(([groupKey, records]) => {
        const [semester, section, session, ...courseParts] =
          groupKey.split("-");
        const courseCode = courseParts.join("-");
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
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {records.flatMap((entry) =>
                  entry.attendanceRecords.map((record) => (
                    <tr key={`${entry.date}-${record.studentId}`}>
                      <td>{new Date(entry.date).toLocaleDateString()}</td>
                      <td>{record.studentId1}</td>
                      <td>{record.studentName}</td>
                      <td>{entry.courseTitle}</td>
                      <td>
                        <select
                          value={record.status}
                          onChange={(e) =>
                            handleStatusChange(
                              groupKey,
                              entry.date,
                              record.studentId,
                              e.target.value
                            )
                          }
                        >
                          <option value="Present">Present</option>
                          <option value="Absent">Absent</option>
                        </select>
                      </td>
                      <td>
                        <button
                          onClick={() =>
                            updateAttendance(
                              entry._id,
                              record._id,
                              record.status
                            )
                          }
                          className="btn btn-primary"
                        >
                          Save
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
};

export default ViewAttendance;
