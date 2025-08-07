import React, { useState } from "react";
import { FaPlus, FaGlobeAmericas } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const FloatingActionButton = ({ setView }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const buttonStyle = {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    zIndex: 1000,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  };

  const mainButtonStyle = {
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    backgroundColor: "#1976d2", // Using primary color from your theme
    color: "white",
    border: "none",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "transform 0.3s ease-in-out",
  };

  const optionButtonStyle = {
    marginBottom: "10px",
    padding: "10px 15px",
    borderRadius: "20px",
    backgroundColor: "white",
    color: "#263238", // Using text color from your theme
    border: "1px solid #e0e0e0",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    opacity: isHovered ? 1 : 0,
    visibility: isHovered ? "visible" : "hidden",
    transform: isHovered ? "translateY(0)" : "translateY(20px)",
    transition: "opacity 0.3s ease, transform 0.3s ease",
  };

  return (
    <div
      style={buttonStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        style={{
          ...optionButtonStyle,
          transform: isHovered ? "translateY(0)" : "translateY(10px)",
        }}
        onClick={() => navigate("/atlas")}
      >
        <FaGlobeAmericas /> Atlas View
      </button>
      <button style={mainButtonStyle}>
        <FaPlus
          size={24}
          style={{
            transform: `rotate(${isHovered ? "135deg" : "0deg"})`,
            transition: "transform 0.3s ease-in-out",
          }}
        />
      </button>
    </div>
  );
};

export default FloatingActionButton;
