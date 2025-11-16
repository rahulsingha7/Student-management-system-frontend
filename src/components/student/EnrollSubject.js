// src/components/EnrollSubject.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EnrollSubject = () => {
  const [sessions, setSessions] = useState([]); // Stores available sessions
  const [selectedSession, setSelectedSession] = useState(""); // Stores the chosen session
  const [subjects, setSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const studentId = localStorage.getItem("userId");
  const navigate = useNavigate();
  // Fetch sessions and subjects on component mount
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/admin/sessions`
        );
        setSessions(response.data);
      } catch (error) {
        displayError("Error fetching sessions:", error);
      }
    };

    const fetchSubjects = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/student/enrollment/available-subjects`
        );
        setSubjects(response.data);
      } catch (error) {
        displayError("Error fetching subjects:", error);
      }
    };

    fetchSessions();
    fetchSubjects();
  }, []);

  // Update filtered subjects when a new session is selected
  useEffect(() => {
    if (selectedSession) {
      setFilteredSubjects(
        subjects.filter((subject) => subject.session._id === selectedSession)
      );
    }
  }, [selectedSession, subjects]);

  const handleSessionChange = (e) => {
    setSelectedSession(e.target.value);
    setSelectedSubjects([]); // Clear selections when the session changes
  };

  const handleCheckboxChange = (subjectId, sectionId, semesterId) => {
    const selected = {
      subjectId,
      sectionId,
      semesterId,
      sessionId: selectedSession,
    };
    setSelectedSubjects((prevSelected) =>
      prevSelected.some(
        (item) => item.subjectId === subjectId && item.sectionId === sectionId
      )
        ? prevSelected.filter(
            (item) =>
              !(item.subjectId === subjectId && item.sectionId === sectionId)
          )
        : [...prevSelected, selected]
    );
  };

  const handleConfirmEnrollment = async () => {
    if (selectedSubjects.length === 0) {
      displayMessage("Please select at least one subject to enroll.");
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/student/enrollment/enroll`,
        {
          studentId,
          selectedSubjects,
        }
      );
      displayMessage(response.data.message);
      setSelectedSubjects([]);
      navigate("/student/view-enrolled-subjects");
    } catch (error) {
      // setError("Enrollment failed.");
      displayError("Error enrolling subjects:", error);
    }
  };
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
      <h2>Enroll in Subjects</h2>

      {/* Session Dropdown */}
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

      {/* Subjects Table */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Select</th>
            <th>Semester</th>
            <th>Section</th>
            <th>Course Code</th>
            <th>Course Title</th>
          </tr>
        </thead>
        <tbody>
          {filteredSubjects.map((subject) =>
            subject.sections.map((section) => (
              <tr key={`${subject._id}-${section._id}`}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedSubjects.some(
                      (s) =>
                        s.subjectId === subject._id &&
                        s.sectionId === section._id
                    )}
                    onChange={() =>
                      handleCheckboxChange(
                        subject._id,
                        section._id,
                        subject.semester._id
                      )
                    }
                  />
                </td>
                <td>{subject.semester.semester}</td>
                <td>{section.section}</td>
                <td>{subject.courseCode}</td>
                <td>{subject.courseTitle}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <button onClick={handleConfirmEnrollment} className="btn btn-primary">
        Confirm Enrollment
      </button>
    </div>
  );
};

export default EnrollSubject;
