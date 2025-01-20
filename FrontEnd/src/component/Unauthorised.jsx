import React from "react";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Unauthorized</h1>
      <p>You do not have permission to access this page.</p>
      <button 
        onClick={() => navigate("/")} // Go back to the previous page
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#f44336",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Go Back
      </button>
    </div>
  );
};

export default Unauthorized;
