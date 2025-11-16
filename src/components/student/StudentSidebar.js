// src/components/StudentSidebar.js

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./StudentSidebar.css"; // Custom styles

const StudentSidebar = ({ username }) => {
  const [openSection, setOpenSection] = useState(null);
  const navigate = useNavigate();
  const studentId = localStorage.getItem("userId");

  const toggleDropdown = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/student/login");
  };

  return (
    <div className="d-flex flex-column bg-dark vh-100 p-3 text-white sidebar">
      <div>
        <div className="mb-4">
          <h4>Welcome, {username}</h4>
        </div>

        {/* Sidebar Sections */}
        {[
          {
            name: "Subject Enrollment",
            links: [
              { label: "Enroll in Subject", to: "/student/enroll-subject" },
              {
                label: "View Enrolled Subjects",
                to: "/student/view-enrolled-subjects",
              },
            ],
          },
          {
            name: "Assignment Management",
            links: [
              {
                label: "Submit Assignments",
                to: "/student/submit-assignments",
              },
              {
                label: "View Submitted Assignments",
                to: `/student/view-submitted/${studentId}`,
              },
            ],
          },
          {
            name: "CT Exam Management",
            links: [
              { label: "View CT Exams", to: "/student/view-ct-exams" },
              {
                label: "View CT Exam Marks",
                to: "/student/view-ct-exam-marks",
              },
            ],
          },
          {
            name: "Results",
            links: [
              { label: "View Grades", to: "/student/view-grades" },
              {
                label: "View Results by Semester",
                to: "/student/results-by-semester",
              },
            ],
          },
          {
            name: "Attendance",
            links: [
              { label: "View Attendance", to: "/student/view-attendance" },
            ],
          },
          {
            name: "Class Schedule",
            links: [
              {
                label: "View Class Schedule",
                to: "/student/view-class-schedule",
              },
            ],
          },
        ].map((section, idx) => (
          <div key={idx}>
            <h5
              className="sidebar-section"
              onClick={() => toggleDropdown(section.name)}
            >
              {section.name}
            </h5>
            {openSection === section.name && (
              <div className="ml-3 sidebar-submenu">
                {section.links.map((link, linkIdx) => (
                  <Link key={linkIdx} to={link.to} className="sidebar-link">
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-auto">
        <button onClick={handleLogout} className="btn btn-danger w-100">
          Logout
        </button>
      </div>
    </div>
  );
};

export default StudentSidebar;
