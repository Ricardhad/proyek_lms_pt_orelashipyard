import React, { useState } from "react";
import client from "../client"; // Axios instance
import { useNavigate } from "react-router-dom"; // Import useNavigate

const AddCourse = () => {
  const [formData, setFormData] = useState({
    name: "",
    desc: "",
    MentorID: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Initialize navigate

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Prepare request data
      const requestData = {
        name: formData.name,
        desc: formData.desc,
        MentorID: formData.MentorID ? formData.MentorID.split(",") : [], // Convert comma-separated MentorID to array
      };

      // Make API call
      const response = await client.post("/api/admin/Course", requestData);
      setMessage(`Course created successfully: ${response.data.namaCourse}`);

      // Reset form
      setFormData({ name: "", desc: "", MentorID: "" });

      // Navigate back to courses page after success
      setTimeout(() => {
        navigate("/course");
      }, 2000);
    } catch (error) {
      console.error("Error creating course:", error);
      setMessage("Failed to create course. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Add New Course</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="name"
          placeholder="Course Name"
          value={formData.name}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <textarea
          name="desc"
          placeholder="Course Description"
          value={formData.desc}
          onChange={handleChange}
          style={styles.textarea}
        />
        <input
          type="text"
          name="MentorID"
          placeholder="Mentor ID (comma-separated)"
          value={formData.MentorID}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <button type="submit" style={styles.button}>
          Submit
        </button>
      </form>
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
};

// Styling
const styles = {
  container: {
    padding: "20px",
    maxWidth: "500px",
    margin: "0 auto",
    textAlign: "center",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  textarea: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    resize: "none",
  },
  button: {
    padding: "10px",
    fontSize: "16px",
    backgroundColor: "#333",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  message: {
    marginTop: "20px",
    fontSize: "14px",
    color: "green",
  },
};

export default AddCourse;
