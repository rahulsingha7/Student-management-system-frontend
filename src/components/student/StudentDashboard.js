import React, { useEffect, useState } from "react";

const StudentDashboard = () => {
  const [studentInfo, setStudentInfo] = useState({
    name: "",
    studentId: "",
    email: "",
  });

  useEffect(() => {
    const name = localStorage.getItem("username");
    const studentId = localStorage.getItem("studentId");
    const email = localStorage.getItem("email");

    setStudentInfo({ name, studentId, email });
  }, []);

  return (
    <div className="flex-grow-1 p-4">
      <h1>Student Info</h1>
      <div className="mt-3">
        <p>
          <strong>Name:</strong> {studentInfo.name}
        </p>
        <p>
          <strong>Student ID:</strong> {studentInfo.studentId}
        </p>
        <p>
          <strong>Email:</strong> {studentInfo.email}
        </p>
      </div>
    </div>
  );
};

export default StudentDashboard;
