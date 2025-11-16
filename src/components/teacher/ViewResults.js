/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ViewResults = () => {
  const teacherId = localStorage.getItem("userId");
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState("");
  const [groupedResults, setGroupedResults] = useState({});
  const [filteredResults, setFilteredResults] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const fetchSessions = async () => {
    try {
      const response = await axios.get("http://localhost:5000/admin/sessions");
      setSessions(response.data);
    } catch (error) {
      setError("Failed to fetch sessions.");
    }
  };

  const fetchResults = async (sessionId) => {
    try {
      const response = await axios.get(
        "http://localhost:5000/teacher/results",
        { params: { teacherId, sessionId } }
      );

      const sessionSpecificResults = Object.entries(response.data).reduce(
        (acc, [groupKey, records]) => {
          const filteredRecords = records.filter(
            (record) => record.sessionId === sessionId
          );
          if (filteredRecords.length > 0) {
            acc[groupKey] = filteredRecords;
          }
          return acc;
        },
        {}
      );

      setGroupedResults(sessionSpecificResults);
      setFilteredResults(sessionSpecificResults); // Initialize filtered data
    } catch (error) {
      setError("Failed to fetch results.");
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleSessionChange = (e) => {
    const sessionId = e.target.value;
    setSelectedSession(sessionId);
    if (sessionId) {
      fetchResults(sessionId);
    } else {
      setGroupedResults({});
      setFilteredResults({});
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredResults(groupedResults); // Reset filter if search term is empty
      return;
    }
    const lowercasedTerm = term.toLowerCase();
    const filteredData = Object.entries(groupedResults).reduce(
      (acc, [groupKey, records]) => {
        const filteredRecords = records.filter(
          (record) =>
            record.studentId1.includes(lowercasedTerm) ||
            record.studentName.toLowerCase().includes(lowercasedTerm) ||
            record.courseCode.toLowerCase().includes(lowercasedTerm) ||
            record.courseTitle.toLowerCase().includes(lowercasedTerm)
        );
        if (filteredRecords.length > 0) {
          acc[groupKey] = filteredRecords;
        }
        return acc;
      },
      {}
    );
    setFilteredResults(filteredData);
  };

  if (!sessions.length) return <div>Loading sessions...</div>;

  return (
    <div className="container">
      {error && <div className="alert alert-danger">{error}</div>}

      <h2>View and Grade Results</h2>
      <div className="mb-3">
        <select
          className="form-control"
          value={selectedSession}
          onChange={handleSessionChange}
        >
          <option value="">Select Session</option>
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
          placeholder="Search by student ID, name, course code, or title"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
      {Object.entries(filteredResults).map(([groupKey, records]) => {
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
                  <th>Session</th>
                  <th>Student ID</th>
                  <th>Student Name</th>
                  <th>Semester</th>
                  <th>Section</th>
                  <th>Course Title</th>
                  <th>Course Code</th>
                  <th>Total Marks</th>
                  <th>Letter Grade</th>
                  <th>Grade Point</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => {
                  const {
                    totalMarks,
                    letterGrade,
                    grade,
                    studentId1,
                    studentId,
                    studentName,
                    semester,
                    section,
                    courseCode,
                    courseTitle,
                    session,
                  } = record;

                  return (
                    <tr key={studentId}>
                      <td>{session}</td>
                      <td>{studentId1}</td>
                      <td>{studentName}</td>
                      <td>{semester}</td>
                      <td>{section}</td>
                      <td>{courseTitle}</td>
                      <td>{courseCode}</td>
                      <td>{totalMarks || "Not Graded Yet"}</td>
                      <td>{letterGrade || "Not Graded Yet"}</td>
                      <td>{grade || "Not Graded Yet"}</td>
                      <td>
                        {grade === "Not Graded Yet" ? (
                          <button
                            onClick={() =>
                              navigate(`/teacher/grade-student`, {
                                state: {
                                  studentId,
                                  studentId1,
                                  studentName,
                                  subjectId: record.subjectId,
                                  semesterId: record.semesterId,
                                  sectionId: record.sectionId,
                                  sessionId: record.sessionId,
                                },
                              })
                            }
                            className="btn btn-primary"
                          >
                            Grade Student
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              navigate(`/teacher/view-grades`, {
                                state: {
                                  studentId,
                                  studentId1,
                                  studentName,
                                  subjectId: record.subjectId,
                                  semesterId: record.semesterId,
                                  sectionId: record.sectionId,
                                  session: record.session,
                                },
                              })
                            }
                            className="btn btn-secondary"
                          >
                            View Grade
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
};

export default ViewResults;
