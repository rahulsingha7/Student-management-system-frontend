import React, { useEffect, useState } from "react";

const TeacherDashboard = () => {
  const [teacherInfo, setTeacherInfo] = useState({
    name: "",
    teacherId: "",
    email: "",
  });

  useEffect(() => {
    const name = localStorage.getItem("username");
    const teacherId = localStorage.getItem("teacherId");
    const email = localStorage.getItem("email");

    setTeacherInfo({ name, teacherId, email });
  }, []);

  return (
    <div className="flex-grow-1 p-4">
      <h1>Teacher Info</h1>
      <div className="mt-3">
        <p>
          <strong>Name:</strong> {teacherInfo.name}
        </p>
        <p>
          <strong>Teacher ID:</strong> {teacherInfo.teacherId}
        </p>
        <p>
          <strong>Email:</strong> {teacherInfo.email}
        </p>
      </div>
    </div>
  );
};

export default TeacherDashboard;
