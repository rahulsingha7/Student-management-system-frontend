import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Sidebar.css"; // Custom styles

const Sidebar = ({ username }) => {
  const [openSection, setOpenSection] = useState(null);
  const navigate = useNavigate();

  const toggleDropdown = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/admin/login");
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
            name: "User Management",
            links: [
              { label: "View Admin List", to: "/admin/view-admins" },
              { label: "View Student List", to: "/admin/view-students" },
              { label: "Create Teacher", to: "/teacher/register" },
              { label: "View Teacher List", to: "/admin/view-teachers" },
            ],
          },
          {
            name: "Enrollment Management",
            links: [
              { label: "View Enrollments", to: "/admin/view-enrollments" },
            ],
          },
          {
            name: "Subject Management",
            links: [
              { label: "Create Subject", to: "/admin/create-subject" },
              { label: "View Subjects", to: "/admin/view-subjects" },
            ],
          },
          {
            name: "Result Management",
            links: [
              { label: "View Result", to: "/admin/view-results" },
              {
                label: "View Student Overall Result",
                to: "/admin/view-overall-result",
              },
            ],
          },

          {
            name: "Teacher Scheduling",
            links: [
              {
                label: "Create Class Schedule",
                to: "/admin/create-teacher-schedule",
              },
              {
                label: "View Class Schedules",
                to: "/admin/view-teacher-schedules",
              },
            ],
          },
          {
            name: "Semester",
            links: [
              { label: "Create Semester", to: "/admin/create-semester" },
              { label: "View Semester", to: "/admin/view-semesters" },
            ],
          },
          {
            name: "Session",
            links: [
              { label: "Create Session", to: "/admin/create-session" },
              { label: "View Sessions", to: "/admin/view-sessions" },
            ],
          },
          {
            name: "Section",
            links: [
              { label: "Create Section", to: "/admin/create-section" },
              { label: "View Sections", to: "/admin/view-sections" },
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

export default Sidebar;
