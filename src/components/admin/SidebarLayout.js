import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import "./SidebarLayout.css";
const SidebarLayout = ({ children }) => {
  const [username, setUsername] = useState("Admin");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  return (
    <div className="d-flex main-content">
      <Sidebar username={username} />
      <div className="container-fluid p-4">{children}</div>
    </div>
  );
};

export default SidebarLayout;
