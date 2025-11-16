import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateTeacherSchedule = () => {
  const [teacherId, setTeacherId] = useState("");
  const [subject, setSubject] = useState("");
  const [semester, setSemester] = useState("");
  const [session, setSession] = useState("");
  const [section, setSection] = useState("");
  const [day, setDay] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [sections, setSections] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teacherRes, semesterRes, sessionRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/teacher/list`),
          axios.get(`${process.env.REACT_APP_API_URL}/admin/semesters`),
          axios.get(`${process.env.REACT_APP_API_URL}/admin/sessions`),
        ]);
        setTeachers(teacherRes.data);
        setSemesters(semesterRes.data);
        setSessions(sessionRes.data);
      } catch (error) {
        setError("Failed to load data");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (session) {
      // Fetch subjects based on selected session
      axios
        .get(
          `${process.env.REACT_APP_API_URL}/admin/teacher-schedule/subjects/session/${session}`
        )
        .then((response) => setSubjects(response.data))
        .catch((error) => setError("Failed to fetch subjects"));
    }
  }, [session]);

  useEffect(() => {
    if (semester) {
      // Fetch sections based on selected semester and session
      axios
        .get(
          `${process.env.REACT_APP_API_URL}/admin/teacher-schedule/sections/semester/${semester}/session/${session}`
        )
        .then((response) => setSections(response.data))
        .catch((error) => setError("Failed to fetch sections"));
    }
  }, [semester, session]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/admin/teacher-schedule`,
        {
          teacherId,
          subject,
          semester,
          session,
          section,
          day,
          startTime,
          endTime,
        }
      );
      displayMessage("Teacher Schedule created successfully!");
      navigate("/admin/view-teacher-schedules");
    } catch (error) {
      console.error(error);
      displayError(
        error.response?.data?.message || "Failed to create Teacher Schedule"
      );
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
      <h2>Create Teacher Schedule</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Session:</label>
          <select
            className="form-control"
            value={session}
            onChange={(e) => setSession(e.target.value)}
          >
            <option value="">Select Session</option>
            {sessions.map((sess) => (
              <option key={sess._id} value={sess._id}>
                {sess.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Teacher:</label>
          <select
            className="form-control"
            value={teacherId}
            onChange={(e) => setTeacherId(e.target.value)}
          >
            <option value="">Select Teacher</option>
            {teachers.map((teacher) => (
              <option key={teacher._id} value={teacher._id}>
                {teacher.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Course Code:</label>
          <select
            className="form-control"
            value={subject}
            onChange={(e) => {
              const selectedSubject = e.target.value;
              setSubject(selectedSubject);
              // Set the semester based on the selected subject
              const selectedSubjectData = subjects.find(
                (subj) => subj._id === selectedSubject
              );
              if (selectedSubjectData) {
                setSemester(selectedSubjectData.semester._id);
              }
            }}
          >
            <option value="">Select Course Code</option>
            {subjects.map((subj) => (
              <option key={subj._id} value={subj._id}>
                {subj.courseCode}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Subject:</label>
          <select
            className="form-control"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          >
            <option value="">Select Course Title</option>
            {subjects.map((subj) => (
              <option key={subj._id} value={subj._id}>
                {subj.courseTitle}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Semester:</label>
          <select
            className="form-control"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
          >
            <option value="">Select Semester</option>
            {semesters.map((sem) => (
              <option key={sem._id} value={sem._id}>
                {sem.semester}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Section:</label>
          <select
            className="form-control"
            value={section}
            onChange={(e) => setSection(e.target.value)}
          >
            <option value="">Select Section</option>
            {sections.map((sect) => (
              <option key={sect._id} value={sect._id}>
                {sect.section}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Day:</label>
          <select
            className="form-control"
            value={day}
            onChange={(e) => setDay(e.target.value)}
            required
          >
            <option value="">Select Day</option>
            <option value="Saturday">Saturday</option>
            <option value="Sunday">Sunday</option>
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
          </select>
        </div>

        <div className="form-group">
          <label>Start Time:</label>
          <input
            type="time"
            className="form-control"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>End Time:</label>
          <input
            type="time"
            className="form-control"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary mt-3">
          Create Teacher Schedule
        </button>
      </form>
    </div>
  );
};

export default CreateTeacherSchedule;
