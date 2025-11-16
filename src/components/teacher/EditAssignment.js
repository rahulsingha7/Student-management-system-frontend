import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditAssignment = () => {
  const { id } = useParams(); // Get assignment ID from URL
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    courseCode: "",
    courseTitle: "",
    semester: "",
    section: "",
    session: "",
  });

  const [mySchedules, setMySchedules] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [filteredSections, setFilteredSections] = useState([]);
  const [filteredSemesters, setFilteredSemesters] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const teacherId = localStorage.getItem("userId");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/teacher/assignments/${id}`
        );
        const assignment = response.data;
        setFormData({
          ...assignment,
          dueDate: assignment.dueDate.substring(0, 10), // Format date to YYYY-MM-DD
          semester: assignment.semester._id,
          section: assignment.section._id,
          session: assignment.session._id,
        });
      } catch (error) {
        displayError("Error fetching assignment details. Please try again later.");
      }
    };

    const fetchMySchedules = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/admin/teacher-schedule"
        );
        const filteredSchedules = response.data.filter(
          (schedule) => schedule.teacherId._id === teacherId
        );
        setMySchedules(filteredSchedules);

        // Filter unique sessions
        const uniqueSessions = [
          ...new Map(
            filteredSchedules.map((schedule) => [
              schedule.session._id,
              schedule.session,
            ])
          ).values(),
        ];
        setFilteredSessions(uniqueSessions);
      } catch (error) {
        displayError("Failed to fetch schedules");
      }
    };

    fetchAssignment();
    fetchMySchedules();
  }, [id, teacherId]);

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

    // Filter unique semesters
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
      await axios.put(
        `http://localhost:5000/teacher/assignments/${id}`,
        formData
      );
      displayMessage("Assignment updated successfully!");
      navigate("/teacher/view-assignments"); // Redirect after update
    } catch (error) {
      displayError("Failed to update assignment.");
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
      <h2>Edit Assignment</h2>
      <form onSubmit={handleSubmit}>
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
            {filteredSessions.map((session) => (
              <option key={session._id} value={session._id}>
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
        <button type="submit" className="btn btn-primary mt-3">
          Update Assignment
        </button>
      </form>
    </div>
  );
};

export default EditAssignment;
