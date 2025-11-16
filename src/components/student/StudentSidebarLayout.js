import React, { useEffect, useState } from "react";
import StudentSidebar from "./StudentSidebar";
import "./StudentSidebarLayout.css";
const StudentSidebarLayout = ({ children }) => {
  const [username, setUsername] = useState("Student");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  return (
    <div className="d-flex main-content">
      <StudentSidebar username={username} />
      <div className="container-fluid p-4">{children}</div>{" "}
      {/* Only child content here */}
    </div>
  );
};

export default StudentSidebarLayout;
