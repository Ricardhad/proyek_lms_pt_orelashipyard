import React from "react";

const AddMentor = () => {
  const mentors = [
    {
      id: 1,
      name: "Esthera Jackson",
      email: "esthera@simmple.com",
      phone: "08123456789",
      role: "Learning and Development",
      image: "https://via.placeholder.com/100", // Ganti dengan URL gambar
    },
    {
      id: 2,
      name: "Esthera Jackson",
      email: "esthera@simmple.com",
      phone: "08123456789",
      role: "Learning and Development",
      image: "https://via.placeholder.com/100",
    },
    {
      id: 3,
      name: "Esthera Jackson",
      email: "esthera@simmple.com",
      phone: "08123456789",
      role: "Learning and Development",
      image: "https://via.placeholder.com/100",
    },
    {
      id: 4,
      name: "Esthera Jackson",
      email: "esthera@simmple.com",
      phone: "08123456789",
      role: "Learning and Development",
      image: "https://via.placeholder.com/100",
    },
  ];

  const containerStyle = {
    padding: "20px",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px",
    justifyItems: "center",
  };

  const cardStyle = {
    backgroundColor: "#f8f8f8",
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "15px",
    textAlign: "center",
    width: "150px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  };

  const imageStyle = {
    borderRadius: "10px",
    width: "100%",
    height: "auto",
    marginBottom: "10px",
  };

  const textStyle = {
    fontSize: "12px",
    color: "#777",
    margin: "5px 0",
  };

  const buttonContainerStyle = {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginTop: "10px",
  };

  const buttonStyle = {
    padding: "5px 10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "12px",
  };

  const editButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#007bff",
    color: "white",
  };

  const detailButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#6c757d",
    color: "white",
  };

  const addCardStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    border: "2px dashed #ccc",
    borderRadius: "10px",
    width: "150px",
    height: "230px",
    fontSize: "50px",
    color: "#777",
    cursor: "pointer",
  };

  return (
    <div style={containerStyle}>
      <h1>Mentors</h1>
      <div style={gridStyle}>
        {mentors.map((mentor) => (
          <div key={mentor.id} style={cardStyle}>
            <img src={mentor.image} alt={mentor.name} style={imageStyle} />
            <h3>{mentor.name}</h3>
            <p style={textStyle}>{mentor.email}</p>
            <p style={textStyle}>{mentor.phone}</p>
            <p style={textStyle}>{mentor.role}</p>
            <div style={buttonContainerStyle}>
              <button style={editButtonStyle}>Edit</button>
              <button style={detailButtonStyle}>Detail</button>
            </div>
          </div>
        ))}
        {/* Kartu Tambah Mentor */}
        <div style={addCardStyle}>
          <span>+</span>
        </div>
      </div>
    </div>
  );
};

export default AddMentor;
