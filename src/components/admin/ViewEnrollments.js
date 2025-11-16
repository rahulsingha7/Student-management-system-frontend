/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import axios from "axios";

const ViewEnrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [search, setSearch] = useState("");
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [selectedSession, setSelectedSession] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch sessions on component mount
  useEffect(() => {
    fetchSessions();
  }, []);

  // Fetch enrollments whenever the selected session or search query changes
  useEffect(() => {
    if (selectedSession) {
      fetchEnrollments();
    }
  }, [search, selectedSession]);

  const fetchSessions = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/admin/sessions`);
      setSessions(response.data);
    } catch (error) {
      displayError("Error fetching sessions.");
    }
  };

  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/admin/enroll/enrollments?search=${search}&sessionId=${selectedSession}`
      );
      setEnrollments(response.data);
    } catch (error) {
      displayError("Error fetching enrollments.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (
    enrollmentId,
    subjectId,
    sectionId,
    currentStatus
  ) => {
    const newStatus = currentStatus === "pending" ? "approved" : "pending";
    const confirmation = window.confirm(
      `Are you sure you want to change the status to ${newStatus}?`
    );

    if (!confirmation) return;

    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/admin/enroll/enrollment/status`, {
        enrollmentId,
        subjectId,
        sectionId,
        status: newStatus,
      });

      // Update status in local state without refetching
      setEnrollments((prevEnrollments) =>
        prevEnrollments.map((enrollment) =>
          enrollment._id === enrollmentId
            ? {
                ...enrollment,
                subjects: enrollment.subjects.map((subject) =>
                  subject.subject._id === subjectId &&
                  subject.section._id === sectionId
                    ? { ...subject, status: newStatus }
                    : subject
                ),
              }
            : enrollment
        )
      );
    } catch (error) {
      displayError("Error updating status.");
    }
  };

  const handleDelete = async (enrollmentId, subjectId, sectionId) => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this enrollment or subject?"
    );
    if (!confirmation) return;

    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/admin/enroll/enrollment/delete`,
        {
          data: { enrollmentId, subjectId, sectionId },
        }
      );

      // Update enrollments in local state by removing the deleted subject
      setEnrollments((prevEnrollments) =>
        prevEnrollments.map((enrollment) =>
          enrollment._id === enrollmentId
            ? {
                ...enrollment,
                subjects: enrollment.subjects.filter(
                  (subject) =>
                    !(
                      subject.subject._id === subjectId &&
                      subject.section._id === sectionId
                    )
                ),
              }
            : enrollment
        )
      );
    } catch (error) {
      displayError("Error deleting enrollment.");
    }
  };

  const displayError = (errMsg) => {
    setError(errMsg);
    setTimeout(() => setError(""), 5000); // Clear after 5 seconds
  };
  const handleApproveAll = async () => {
    if (!selectedSession) {
      displayError("Please select a session first.");
      return;
    }

    const confirmation = window.confirm(
      `Are you sure you want to approve all enrollments for the session: ${
        sessions.find((s) => s._id === selectedSession)?.name
      }?`
    );

    if (!confirmation) return;

    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/admin/enroll/enrollment/approve-all`,
        {
          sessionId: selectedSession,
        }
      );

      // Update the local state to set all statuses to "approved"
      setEnrollments((prevEnrollments) =>
        prevEnrollments.map((enrollment) => ({
          ...enrollment,
          subjects: enrollment.subjects.map((subject) =>
            subject.session._id === selectedSession
              ? { ...subject, status: "approved" }
              : subject
          ),
        }))
      );

      setMessage("All enrollments approved successfully.");
      setTimeout(() => setMessage(""), 5000); // Clear message after 5 seconds
    } catch (error) {
      displayError("Error approving all enrollments.");
    }
  };

  return (
    <div className="container">
      {message && <div className="alert alert-info">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <h2>Enrollment List</h2>

      {/* Session Dropdown */}
      <div className="mb-3">
        <label>Select Session</label>
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
      <div className="mb-3">
        <button
          className="btn btn-primary"
          onClick={handleApproveAll}
          disabled={!selectedSession || enrollments.length === 0}
        >
          Approve All
        </button>
      </div>

      {/* Search Input */}
      {selectedSession && (
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search enrollments by student name, ID, or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      )}

      {/* Enrollments Table */}
      {loading ? (
        <div>Loading Enrollments...</div>
      ) : selectedSession && enrollments.length > 0 ? (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Name</th>
              <th>Email</th>
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
            {enrollments.map((enrollment) =>
              enrollment.subjects.map((subject) => (
                <tr key={`${enrollment._id}-${subject.subject._id}`}>
                  <td>{enrollment.student.studentId}</td>
                  <td>{enrollment.student.name}</td>
                  <td>{enrollment.student.email}</td>
                  <td>{subject.session.name}</td>
                  <td>{subject.semester.semester}</td>
                  <td>{subject.section.section}</td>
                  <td>{subject.subject.courseCode}</td>
                  <td>{subject.subject.courseTitle}</td>
                  <td>{subject.status}</td>
                  <td>
                    <button
                      className={`btn ${
                        subject.status === "pending"
                          ? "btn-success"
                          : "btn-warning"
                      } me-2`}
                      onClick={() =>
                        handleStatusChange(
                          enrollment._id,
                          subject.subject._id,
                          subject.section._id,
                          subject.status
                        )
                      }
                    >
                      {subject.status === "pending" ? "Approve" : "Pending"}
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() =>
                        handleDelete(
                          enrollment._id,
                          subject.subject._id,
                          subject.section._id
                        )
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      ) : selectedSession ? (
        <div>No enrollments found for the selected session.</div>
      ) : (
        <div>Please select a session to view enrollments.</div>
      )}
    </div>
  );
};

export default ViewEnrollments;
