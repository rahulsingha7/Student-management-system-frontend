/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";

const MarkAttendance = () => {
  const teacherId = localStorage.getItem("userId");
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);
  const [groupedData, setGroupedData] = useState({});
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
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
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/admin/sessions`
      );
      setSessions(response.data);
    } catch (error) {
      displayError("Failed to fetch sessions.");
    }
  };

  const fetchStudentsForAttendance = async () => {
    if (!selectedSession) {
      setGroupedData({});
      return;
    }

    setLoading(true);

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/teacher/attendance/students`,
        { params: { teacherId, sessionId: selectedSession } } // Pass sessionId explicitly
      );

      const students = response.data.filter(
        (student) => student.sessionId === selectedSession // Additional filtering in the frontend
      );

      const grouped = students.reduce((acc, student) => {
        const groupKey = `${student.semester}-${student.section}-${student.session}-${student.courseCode}-${student.courseTitle}`;
        if (!acc[groupKey]) {
          acc[groupKey] = [];
        }
        acc[groupKey].push({
          ...student,
          subjectId: student.subjectId,
          semesterId: student.semesterId,
          sectionId: student.sectionId,
          sessionId: student.sessionId,
        });
        return acc;
      }, {});

      setAttendanceData(students);
      setGroupedData(grouped);
      setLoading(false);
    } catch (error) {
      displayError("Failed to fetch attendance data.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    fetchStudentsForAttendance();
  }, [selectedSession]);

  const handleAttendanceChange = (groupKey, studentId, status) => {
    setGroupedData((prev) => {
      const updated = {
        ...prev,
        [groupKey]: prev[groupKey].map((student) =>
          student.studentId === studentId ? { ...student, status } : student
        ),
      };
      return updated;
    });
  };

  const submitAttendance = async (groupKey) => {
    const studentsInGroup = groupedData[groupKey];

    if (!studentsInGroup || studentsInGroup.length === 0) {
      displayError("Invalid group data. Please check the input.");
      return;
    }

    const { subjectId, semesterId, sectionId, sessionId } = studentsInGroup[0];

    if (!subjectId || !semesterId || !sectionId || !sessionId) {
      displayError("Invalid data. Missing required fields.");
      return;
    }

    const attendanceRecords = studentsInGroup.map(({ studentId, status }) => ({
      studentId,
      status,
    }));

    const payload = {
      date,
      teacherId,
      attendanceRecords,
      semester: semesterId,
      section: sectionId,
      session: sessionId,
      subject: subjectId,
    };

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/teacher/attendance/mark`,
        payload
      );
      displayMessage(`Attendance for group "${groupKey}" marked successfully!`);
    } catch (error) {
      if (error.response && error.response.status === 409) {
        displayError(
          "Attendance for this group has already been marked for the selected date."
        );
      } else {
        displayError("Failed to submit attendance for this group.");
      }
    }
  };

  return (
    <div className="container">
      <h2>Mark Attendance</h2>

      {message && <div className="alert alert-info">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div>
        <label>Select Session: </label>
        <select
          value={selectedSession}
          onChange={(e) => setSelectedSession(e.target.value)}
        >
          <option value="">--Select Session--</option>
          {sessions.map((session) => (
            <option key={session._id} value={session._id}>
              {session.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Date: </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {loading ? (
        <div>Loading attendance data...</div>
      ) : Object.keys(groupedData).length > 0 ? (
        Object.entries(groupedData).map(([groupKey, students]) => {
          const [semester, section, session, courseCode, courseTitle] =
            groupKey.split("-");
          return (
            <div key={groupKey} className="mb-5">
              <h3>
                {semester} {section} {session} - {courseCode} {courseTitle}
              </h3>
              <table className="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th>Student ID</th>
                    <th>Student Name</th>
                    <th>Course Title</th>
                    <th>Attendance</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.studentId}>
                      <td>{student.studentId1}</td>
                      <td>{student.studentName}</td>
                      <td>{student.courseTitle}</td>
                      <td>
                        <select
                          value={student.status}
                          onChange={(e) =>
                            handleAttendanceChange(
                              groupKey,
                              student.studentId,
                              e.target.value
                            )
                          }
                        >
                          <option value="Present">Present</option>
                          <option value="Absent">Absent</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                onClick={() => submitAttendance(groupKey)}
                className="btn btn-primary mt-3"
              >
                Submit Attendance for {courseCode} {courseTitle}
              </button>
            </div>
          );
        })
      ) : (
        <p>No attendance data available for the selected session.</p>
      )}
    </div>
  );
};

export default MarkAttendance;
