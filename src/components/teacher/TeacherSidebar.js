// src/components/TeacherSidebar.js

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./TeacherSidebar.css"; // Custom styles

const TeacherSidebar = ({ username }) => {
  const [openSection, setOpenSection] = useState(null);
  const navigate = useNavigate();

  const toggleDropdown = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/teacher/login");
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
            name: "Assignment Management",
            links: [
              { label: "Create Assignment", to: "/teacher/create-assignment" },
              { label: "View Assignments", to: "/teacher/view-assignments" },
            ],
          },
          {
            name: "Review Assignments",
            links: [
              {
                label: "View Submitted Assignments",
                to: "/teacher/view-submitted-assignments",
              },
            ],
          },
          {
            name: "Attendance Management",
            links: [
              { label: "Mark Attendance", to: "/teacher/mark-attendance" },
              { label: "View Attendance", to: "/teacher/view-attendance" },
            ],
          },
          {
            name: "CT Exam Management",
            links: [
              { label: "Assign CT Exam", to: "/teacher/create-ct-exam" },
              { label: "View CT Exams", to: "/teacher/view-ct-exams" },
              { label: "Mark CT Exams", to: "/teacher/mark-ct-exams" },
            ],
          },
          {
            name: "Result Management",
            links: [
              { label: "View Results", to: "/teacher/view-results" },
              // { label: "View CT Exams", to: "/teacher/view-ct-exams" },
              // { label: "Mark CT Exams", to: "/teacher/mark-ct-exams" },
            ],
          },
          {
            name: "Class Schedule",
            links: [
              {
                label: "View Class Schedule",
                to: "/teacher/view-class-schedule",
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

export default TeacherSidebar;
