/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditCTExam = () => {
  const [ctName, setCtName] = useState("CT-1");
  const [examDate, setExamDate] = useState("");
  const [duration, setDuration] = useState("");
  const [subject, setSubject] = useState("");
  const [semester, setSemester] = useState("");
  const [session, setSession] = useState("");
  const [section, setSection] = useState("");
  const [allData, setAllData] = useState([]); // All schedule data
  const [filteredSemesters, setFilteredSemesters] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [filteredSections, setFilteredSections] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const { id } = useParams(); // CT Exam ID from URL
  const teacherId = localStorage.getItem("userId"); // Get logged-in teacher's ID

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all teacher schedules
        const scheduleResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/admin/teacher-schedule?teacherId=${teacherId}`
        );
        const schedule = scheduleResponse.data;

        // Extract unique sessions for initial dropdown
        const uniqueSessions = [
          ...new Map(
            schedule.map((item) => [item.session._id, item.session])
          ).values(),
        ];

        setAllData(schedule);
        setSessions(uniqueSessions);

        // Fetch existing CT exam details
        const ctExamResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/teacher/ct-exams/${id}`
        );
        const ctExam = ctExamResponse.data;

        // Prepopulate the form with existing data
        setCtName(ctExam.ctName);
        setExamDate(ctExam.examDate.substring(0, 10)); // Format date for input
        setDuration(ctExam.duration);
        setSession(ctExam.session._id);
        setSemester(ctExam.semester._id);
        setSection(ctExam.section._id);
        setSubject(ctExam.subject._id);

        // Trigger filtering based on existing values
        filterSemesters(ctExam.session._id);
        filterSubjects(ctExam.semester._id);
        filterSections(ctExam.semester._id);
      } catch (error) {
        displayError("Failed to load data. Please try again.");
      }
    };

    fetchData();
  }, [id, teacherId]);

  const filterSemesters = (selectedSession) => {
    const filtered = allData.filter(
      (item) => item.session._id === selectedSession
    );

    // Remove duplicates
    const uniqueSemesters = [
      ...new Map(
        filtered.map((item) => [item.semester._id, item.semester])
      ).values(),
    ];

    setFilteredSemesters(uniqueSemesters);
  };

  const filterSubjects = (selectedSemester) => {
    const filtered = allData.filter(
      (item) =>
        item.semester._id === selectedSemester && item.session._id === session
    );

    // Remove duplicates
    const uniqueSubjects = [
      ...new Map(
        filtered.map((item) => [item.subject._id, item.subject])
      ).values(),
    ];

    setFilteredSubjects(uniqueSubjects);
  };

  const filterSections = (selectedSemester) => {
    const filtered = allData.filter(
      (item) =>
        item.semester._id === selectedSemester && item.session._id === session
    );

    // Remove duplicates
    const uniqueSections = [
      ...new Map(
        filtered.map((item) => [item.section._id, item.section])
      ).values(),
    ];

    setFilteredSections(uniqueSections);
  };

  const handleSessionChange = (e) => {
    const selectedSession = e.target.value;
    setSession(selectedSession);

    // Clear dependent fields
    setSemester("");
    setSubject("");
    setSection("");

    // Filter semesters based on selected session
    if (selectedSession) {
      filterSemesters(selectedSession);
    } else {
      setFilteredSemesters([]);
      setFilteredSubjects([]);
      setFilteredSections([]);
    }
  };

  const handleSemesterChange = (e) => {
    const selectedSemester = e.target.value;
    setSemester(selectedSemester);

    // Clear dependent fields
    setSubject("");
    setSection("");

    // Filter subjects and sections based on selected semester
    if (selectedSemester) {
      filterSubjects(selectedSemester);
      filterSections(selectedSemester);
    } else {
      setFilteredSubjects([]);
      setFilteredSections([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/teacher/ct-exams/${id}`,
        {
          ctName,
          examDate,
          duration,
          subject,
          semester,
          session,
          section,
        }
      );
      displayMessage("CT Exam updated successfully!");
      navigate("/teacher/view-ct-exams");
    } catch (error) {
      displayError("Failed to update CT Exam.");
    }
  };

  const displayMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 5000); // Clear after 5 seconds
  };

  const displayError = (errMsg) => {
    setError(errMsg);
    setTimeout(() => setError(""), 5000); // Clear after 5 seconds
  };

  return (
    <div className="container">
      {message && <div className="alert alert-info">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <h2>Edit CT Exam</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>CT Name:</label>
          <select
            className="form-control"
            value={ctName}
            onChange={(e) => setCtName(e.target.value)}
            required
          >
            <option value="CT-1">CT-1</option>
            <option value="CT-2">CT-2</option>
            <option value="CT-3">CT-3</option>
          </select>
        </div>
        <div className="form-group">
          <label>Exam Date:</label>
          <input
            type="date"
            className="form-control"
            value={examDate}
            onChange={(e) => setExamDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Duration (minutes):</label>
          <input
            type="number"
            className="form-control"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Session:</label>
          <select
            className="form-control"
            value={session}
            onChange={handleSessionChange}
            required
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
          <label>Semester:</label>
          <select
            className="form-control"
            value={semester}
            onChange={handleSemesterChange}
            required
          >
            <option value="">Select Semester</option>
            {filteredSemesters.map((sem) => (
              <option key={sem._id} value={sem._id}>
                {sem.semester}
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
            required
          >
            <option value="">Select Subject</option>
            {filteredSubjects.map((subj) => (
              <option key={subj._id} value={subj._id}>
                {subj.courseTitle} ({subj.courseCode})
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
            required
          >
            <option value="">Select Section</option>
            {filteredSections.map((sec) => (
              <option key={sec._id} value={sec._id}>
                {sec.section}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          Update CT Exam
        </button>
      </form>
    </div>
  );
};

export default EditCTExam;
