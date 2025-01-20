import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "@client"; // Importing the axios instance from client.js

const handleDelete = async (announcementId) => {
  try {
    await client.delete(`/api/admin/announcement/${announcementId}`); // Use client instead of axios
    setAnnouncements((prev) =>
      prev.filter((announcement) => announcement._id !== announcementId)
    );
  } catch (error) {
    console.error("Error deleting announcement:", error);
  }
};


const AddCourse = () => {
  const [namaCourse, setNamaCourse] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [mentorID, setMentorID] = useState(""); // Mentor ID (opsional)
  const [daftarKelas, setDaftarKelas] = useState(""); // Daftar kelas (opsional)
  const [errorMessage, setErrorMessage] = useState(""); // Untuk menampilkan error
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!namaCourse.trim() || !deskripsi.trim()) {
      setErrorMessage("Course name and description are required.");
      return;
    }
  
    const payload = {
      namaCourse,
      Deskripsi: deskripsi,
      mentorID: mentorID ? [mentorID] : [],
      daftarKelas: daftarKelas ? [daftarKelas] : []
    };
  
    console.log("Payload being sent:", payload);
  
    try {
      const response = await client.post("/api/admin/Course", payload); // Use client instead of axios
      console.log("Response from server:", response);
      navigate("/home"); // Redirect after successful submission
    } catch (error) {
      console.error("Error creating course:", error);
      if (error.response) {
        setErrorMessage(error.response.data.message || "An error occurred.");
      } else {
        setErrorMessage("Failed to add course. Please try again.");
      }
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Add Course</h1>
      {errorMessage && <div style={styles.error}>{errorMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Course Name</label>
          <input
            type="text"
            style={styles.input}
            value={namaCourse}
            onChange={(e) => setNamaCourse(e.target.value)}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Description</label>
          <textarea
            style={styles.textarea}
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Mentor ID (Optional)</label>
          <input
            type="text"
            style={styles.input}
            value={mentorID}
            onChange={(e) => setMentorID(e.target.value)}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Class ID (Optional)</label>
          <input
            type="text"
            style={styles.input}
            value={daftarKelas}
            onChange={(e) => setDaftarKelas(e.target.value)}
          />
        </div>
        <button style={styles.submitButton} type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    backgroundColor: "#f9f9f9",
    minHeight: "100vh",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  formGroup: {
    marginBottom: "15px",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    height: "100px",
  },
  submitButton: {
    backgroundColor: "#28a745",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginBottom: "15px",
    fontWeight: "bold",
  },
};

export default AddCourse;
