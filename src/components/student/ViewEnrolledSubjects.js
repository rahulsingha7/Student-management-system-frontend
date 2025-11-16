/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import axios from "axios";

const ViewEnrolledSubjects = () => {
  const [enrolledSubjects, setEnrolledSubjects] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const studentId = localStorage.getItem("userId");

  // Fetch sessions and enrolled subjects on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch sessions
        const sessionResponse = await axios.get(
          "http://localhost:5000/admin/sessions"
        );
        setSessions(sessionResponse.data);

        // Fetch initial enrolled subjects
        fetchEnrolledSubjects();
      } catch (error) {
        displayError("Error fetching sessions or subjects.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch enrolled subjects with optional session filter
  const fetchEnrolledSubjects = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/student/enrollment/enrolled-subjects/${studentId}?sessionId=${selectedSession}`
      );
      setEnrolledSubjects(response.data.subjects || []);
      setLoading(false);
    } catch (error) {
      displayError("Error fetching enrolled subjects.");
      setLoading(false);
    }
  };

  // Refetch subjects when session filter changes
  useEffect(() => {
    console.log("Selected Session:", selectedSession);
    fetchEnrolledSubjects();
  }, [selectedSession]);

  const handleDeleteSubject = async (subjectId, sectionId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this subject?"
    );

    if (!isConfirmed) return;

    try {
      const response = await axios.delete(
        "http://localhost:5000/student/enrollment/delete-subject",
        {
          data: { studentId, subjectId, sectionId },
        }
      );
      displayMessage(response.data.message);

      // Refresh the enrolled subjects list
      setEnrolledSubjects((prevSubjects) =>
        prevSubjects.filter(
          (subject) =>
            subject.subject._id !== subjectId ||
            subject.section._id !== sectionId
        )
      );
    } catch (error) {
      // setMessage("Failed to delete subject.");
      displayError("Error deleting subject.");
    }
  };

  if (loading) {
    return <div>Loading Enrolled Subjects ...</div>;
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
      <h2>Enrolled Subjects</h2>

      {/* Filters */}
      <div className="filters mb-3">
        <select
          className="form-select mb-3"
          value={selectedSession}
          onChange={(e) => setSelectedSession(e.target.value)}
        >
          <option value="">All Sessions</option>
          {sessions.map((session) => (
            <option key={session._id} value={session._id}>
              {session.name}
            </option>
          ))}
        </select>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Session</th>
            <th>Semester</th>
            <th>Section</th>
            <th>Course Code</th>
            <th>Course Title</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {enrolledSubjects.map((subject) => (
            <tr key={`${subject.subject._id}-${subject.section._id}`}>
              <td>{subject.session.name}</td>
              <td>{subject.semester.semester}</td>
              <td>{subject.section.section}</td>
              <td>{subject.subject.courseCode}</td>
              <td>{subject.subject.courseTitle}</td>
              <td>{subject.status}</td>
              <td>
                {subject.status === "pending" ? (
                  <button
                    className="btn btn-danger"
                    onClick={() =>
                      handleDeleteSubject(
                        subject.subject._id,
                        subject.section._id
                      )
                    }
                  >
                    Delete
                  </button>
                ) : (
                  "Approved"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewEnrolledSubjects;
