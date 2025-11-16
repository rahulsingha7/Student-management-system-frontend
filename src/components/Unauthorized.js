import React from "react";

const Unauthorized = () => {
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
        src="https://i.ibb.co.com/93hb7XC/ua.png"
        alt="Unauthorized"
        style={{
          width: "500px", // Set desired width
          height: "500px", // Set desired height
        }}
      />
    </div>
  );
};

export default Unauthorized;
