/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import axios from "axios";

const CTExamMarks = () => {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState("");
  const [ctExams, setCTExams] = useState([]);
  const teacherId = localStorage.getItem("userId");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await axios.get("http://localhost:5000/admin/sessions");
      setSessions(response.data);
    } catch (err) {
      displayError("Error fetching sessions.");
    }
  };

  const fetchCTExamsWithMarks = async (sessionId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/teacher/ct-exams/with-marks?teacherId=${teacherId}&sessionId=${sessionId}`
      );
      setCTExams(response.data);
    } catch (err) {
      displayError("Error fetching CT exams.");
    }
  };

  const handleSaveMarks = (ctExamId, studentId, marks) => {
    if (!marks || marks < 0) {
      displayError("Please enter valid marks!");
      return;
    }

    axios
      .post("http://localhost:5000/teacher/ct-exams/marks", {
        ctExamId,
        studentId,
        marks,
      })
      .then(() => {
        displayMessage("Marks saved successfully!");
        fetchCTExamsWithMarks(selectedSession);
      })
      .catch((err) => displayError("Error saving marks."));
  };

  const handleUpdateMarks = (markId, marks) => {
    axios
      .put(`http://localhost:5000/teacher/ct-exams/marks/${markId}`, { marks })
      .then(() => {
        displayMessage("Marks updated successfully!");
        fetchCTExamsWithMarks(selectedSession);
      })
      .catch((err) => displayError("Error updating marks."));
  };

  const handleDeleteMarks = (markId) => {
    if (!window.confirm("Are you sure you want to delete this mark?")) {
      return;
    }

    axios
      .delete(`http://localhost:5000/teacher/ct-exams/marks/${markId}`)
      .then(() => {
        displayMessage("Marks deleted successfully!");
        fetchCTExamsWithMarks(selectedSession);
      })
      .catch((err) => displayError("Error deleting marks."));
  };

  const displayMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 5000);
  };

  const displayError = (errMsg) => {
    setError(errMsg);
    setTimeout(() => setError(""), 5000);
  };

  return (
    <div className="container">
      {message && <div className="alert alert-info">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <h2>CT Exam Marks</h2>
      <div className="form-group mb-4">
        <label>Select Session:</label>
        <select
          className="form-control"
          value={selectedSession}
          onChange={(e) => {
            setSelectedSession(e.target.value);
            fetchCTExamsWithMarks(e.target.value);
          }}
        >
          <option value="">-- Select Session --</option>
          {sessions.map((session) => (
            <option key={session._id} value={session._id}>
              {session.name}
            </option>
          ))}
        </select>
      </div>

      {selectedSession && ctExams.length > 0 && (
        <div>
          {ctExams.map((exam) => (
            <div key={exam.ctExamId}>
              <h3>{exam.ctName}</h3>
              <p>
                <strong>Semester:</strong> {exam.semester} |{" "}
                <strong>Section:</strong> {exam.section} |{" "}
                <strong>Course:</strong> {exam.courseCode} - {exam.courseTitle}
              </p>
              <table className="table">
                <thead>
                  <tr>
                    <th>Student ID</th>
                    <th>Student Name</th>
                    <th>Marks</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {exam.students.map((student) => (
                    <tr key={student.studentId}>
                      <td>{student.studentId1}</td>
                      <td>{student.studentName}</td>
                      <td>
                        <input
                          type="number"
                          defaultValue={
                            student.marks === "Not given" ? "" : student.marks
                          }
                          onChange={(e) => (student.marks = e.target.value)}
                        />
                      </td>
                      <td>
                        <button
                          className="btn btn-primary"
                          onClick={() =>
                            student.markId
                              ? handleUpdateMarks(student.markId, student.marks)
                              : handleSaveMarks(
                                  exam.ctExamId,
                                  student.studentId,
                                  student.marks
                                )
                          }
                        >
                          {student.marks === "Not given" ? "Submit" : "Update"}
                        </button>
                        {student.markId && (
                          <button
                            className="btn btn-danger ms-2"
                            onClick={() => handleDeleteMarks(student.markId)}
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CTExamMarks;
