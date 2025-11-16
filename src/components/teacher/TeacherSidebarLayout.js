import React, { useEffect, useState } from "react";
import TeacherSidebar from "./TeacherSidebar";
import "./TeacherSidebarLayout.css";
const TeacherSidebarLayout = ({ children }) => {
  const [username, setUsername] = useState("Teacher");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  return (
    <div className="d-flex main-content">
      <TeacherSidebar username={username} />
      <div className="container-fluid p-4">{children}</div>{" "}
      {/* Only child content here */}
    </div>
  );
};

export default TeacherSidebarLayout;
