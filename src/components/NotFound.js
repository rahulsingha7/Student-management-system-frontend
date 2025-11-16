import React from "react";

const NotFound = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh", // Full viewport height
      }}
    >
      <img
        src="https://i.ibb.co/JFcjSMq/404.jpg"
        alt="Not Found"
        style={{
          width: "500px", // Set desired width
          height: "500px", // Set desired height
        }}
      />
    </div>
  );
};

export default NotFound;
