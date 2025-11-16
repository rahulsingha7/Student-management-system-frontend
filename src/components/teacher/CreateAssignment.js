/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateAssignment = () => {
  const [formData, setFormData] = useState({
    session: "",
    title: "",
    description: "",
    dueDate: "",
    courseCode: "",
    courseTitle: "",
    semester: "",
    section: "",
  });

  const [mySchedules, setMySchedules] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [filteredSections, setFilteredSections] = useState([]);
  const [filteredSemesters, setFilteredSemesters] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const teacherId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const displayMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 5000); // Clear after 5 seconds
  };

  const displayError = (errMsg) => {
    setError(errMsg);
    setTimeout(() => setError(""), 5000); // Clear after 5 seconds
  };
  useEffect(() => {
    const fetchMySchedules = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/admin/teacher-schedule`
        );
        const filteredSchedules = response.data.filter(
          (schedule) => schedule.teacherId._id.toString() === teacherId
        );
        setMySchedules(filteredSchedules);
      } catch (error) {
        displayError("Failed to fetch teacher schedules");
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
      courseCode: "",
      courseTitle: "",
      section: "",
    }));

    const schedulesForSession = mySchedules.filter(
      (schedule) => schedule.session._id === selectedSession
    );

    // Filter unique semesters for the selected session
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
      courseCode: "",
      courseTitle: "",
      section: "",
    }));

    const courses = mySchedules.filter(
      (schedule) =>
        schedule.semester._id === selectedSemester &&
        schedule.session._id === formData.session
    );

    // Filter unique courses
    const uniqueCourses = [
      ...new Map(
        courses.map((course) => [course.subject.courseCode, course.subject])
      ).values(),
    ];

    setFilteredCourses(uniqueCourses);
    setFilteredSections([]);
  };

  const handleCourseCodeChange = (e) => {
    const selectedCourseCode = e.target.value;
    const selectedCourse = filteredCourses.find(
      (course) => course.courseCode === selectedCourseCode
    );

    setFormData((prevData) => ({
      ...prevData,
      courseCode: selectedCourseCode,
      courseTitle: selectedCourse ? selectedCourse.courseTitle : "",
      section: "",
    }));

    const sections = mySchedules
      .filter(
        (schedule) =>
          schedule.subject.courseCode === selectedCourseCode &&
          schedule.semester._id === formData.semester &&
          schedule.session._id === formData.session
      )
      .map((schedule) => schedule.section);

    // Filter unique sections
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
      await axios.post(`${process.env.REACT_APP_API_URL}/teacher/assignments`, {
        ...formData,
        teacherId: teacherId,
      });
      displayMessage("Assignment created successfully!");
      setFormData({
        session: "",
        title: "",
        description: "",
        dueDate: "",
        courseCode: "",
        courseTitle: "",
        semester: "",
        section: "",
      });
      navigate("/teacher/view-assignments");
    } catch (error) {
      displayError("Error creating assignment");
    }
  };

  return (
    <div className="container">
      {message && <div className="alert alert-info">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <h2>Create Assignment</h2>

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
          <label>Course Code:</label>
          <select
            name="courseCode"
            value={formData.courseCode}
            onChange={handleCourseCodeChange}
            className="form-control"
            required
          >
            <option value="">Select Course Code</option>
            {filteredCourses.map((course) => (
              <option key={course.courseCode} value={course.courseCode}>
                {course.courseCode}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Course Title:</label>
          <input
            type="text"
            name="courseTitle"
            value={formData.courseTitle}
            onChange={handleChange}
            className="form-control"
            required
            readOnly
          />
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
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>Due Date:</label>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          Create Assignment
        </button>
      </form>
    </div>
  );
};

export default CreateAssignment;
