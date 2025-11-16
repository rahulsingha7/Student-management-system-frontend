import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateCTExam = () => {
  const [formData, setFormData] = useState({
    session: "",
    ctName: "CT-1",
    examDate: "",
    duration: "",
    subject: "",
    semester: "",
    section: "",
  });

  const [mySchedules, setMySchedules] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [filteredSemesters, setFilteredSemesters] = useState([]);
  const [filteredSections, setFilteredSections] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const teacherId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMySchedules = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/admin/teacher-schedule"
        );
        const filteredSchedules = response.data.filter(
          (schedule) => schedule.teacherId._id.toString() === teacherId
        );
        setMySchedules(filteredSchedules);
      } catch (error) {
        setError("Failed to fetch teacher schedules");
        setTimeout(() => setError(""), 5000);
      }
    };

    fetchMySchedules();
  }, [teacherId]);

  const handleSessionChange = (e) => {
    const selectedSession = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      session: selectedSession,
      semester: "",
      subject: "",
      section: "",
    }));

    const schedulesForSession = mySchedules.filter(
      (schedule) => schedule.session._id === selectedSession
    );

    // Extract unique semesters
    const uniqueSemesters = [
      ...new Map(
        schedulesForSession.map((schedule) => [
          schedule.semester._id,
          schedule.semester,
        ])
      ).values(),
    ];
    setFilteredSemesters(uniqueSemesters);
    setFilteredCourses([]);
    setFilteredSections([]);
  };

  const handleSemesterChange = (e) => {
    const selectedSemester = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      semester: selectedSemester,
      subject: "",
      section: "",
    }));

    const courses = mySchedules.filter(
      (schedule) =>
        schedule.semester._id === selectedSemester &&
        schedule.session._id === formData.session
    );

    // Extract unique subjects
    const uniqueSubjects = [
      ...new Map(
        courses.map((course) => [course.subject._id, course.subject])
      ).values(),
    ];
    setFilteredCourses(uniqueSubjects);
    setFilteredSections([]);
  };

  const handleSubjectChange = (e) => {
    const selectedSubject = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      subject: selectedSubject,
      section: "",
    }));

    const sections = mySchedules
      .filter(
        (schedule) =>
          schedule.subject._id === selectedSubject &&
          schedule.semester._id === formData.semester &&
          schedule.session._id === formData.session
      )
      .map((schedule) => schedule.section);

    // Extract unique sections
    const uniqueSections = [
      ...new Map(sections.map((section) => [section._id, section])).values(),
    ];
    setFilteredSections(uniqueSections);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/teacher/ct-exams", {
        ...formData,
        teacherId,
      });
      setMessage("CT Exam created successfully!");
      setTimeout(() => setMessage(""), 5000);
      navigate("/teacher/view-ct-exams");
    } catch (error) {
      setError("Failed to create CT Exam");
      setTimeout(() => setError(""), 5000);
    }
  };

  return (
    <div className="container">
      {message && <div className="alert alert-info">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <h2>Create CT Exam</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Session:</label>
          <select
            name="session"
            value={formData.session}
            onChange={handleSessionChange}
            className="form-control"
            required
          >
            <option value="">Select Session</option>
            {[
              ...new Map(
                mySchedules.map((schedule) => [
                  schedule.session._id,
                  schedule.session,
                ])
              ),
            ].map(([id, session]) => (
              <option key={id} value={id}>
                {session.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Semester:</label>
          <select
            name="semester"
            value={formData.semester}
            onChange={handleSemesterChange}
            className="form-control"
            required
          >
            <option value="">Select Semester</option>
            {filteredSemesters.map((semester) => (
              <option key={semester._id} value={semester._id}>
                {semester.semester}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Subject:</label>
          <select
            name="subject"
            value={formData.subject}
            onChange={handleSubjectChange}
            className="form-control"
            required
          >
            <option value="">Select Subject</option>
            {filteredCourses.map((subject) => (
              <option key={subject._id} value={subject._id}>
                {subject.courseTitle} ({subject.courseCode})
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Section:</label>
          <select
            name="section"
            value={formData.section}
            onChange={handleChange}
            className="form-control"
            required
          >
            <option value="">Select Section</option>
            {filteredSections.map((section) => (
              <option key={section._id} value={section._id}>
                {section.section}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>CT Name:</label>
          <select
            name="ctName"
            value={formData.ctName}
            onChange={handleChange}
            className="form-control"
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
            name="examDate"
            value={formData.examDate}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>Duration (minutes):</label>
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          Create CT Exam
        </button>
      </form>
    </div>
  );
};

export default CreateCTExam;
