import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../client";

const AddAnnouncement = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [attachments, setAttachments] = useState([]); // Untuk menyimpan file lampiran
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setAttachments(e.target.files); // Menyimpan file yang dipilih
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!title.trim() || !content.trim()) {
      setErrorMessage("Title and content are required.");
      return;
    }
  
    const token = localStorage.getItem("token");
    if (!token) {
      setErrorMessage("User is not logged in.");
      return;
    }
  
    try {
      // Create FormData to send data with file
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", content);
      formData.append("createdBy", "67624e55e0e2c189da418030"); // Replace with the logged-in user's ID
  
      // Add each file to FormData
      for (let i = 0; i < attachments.length; i++) {
        formData.append("attachments", attachments[i]);
      }
  
      // Send the data to the backend
      await client.post("/api/admin/announcement", formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Send token in the header
        },
      });
  
      // Redirect to the announcements page after success
      navigate("/home");
    } catch (error) {
      console.error("Error adding announcement:", error);
  
      if (error.response) {
        setErrorMessage(error.response.data.message || "An error occurred.");
      } else {
        setErrorMessage("Failed to add announcement. Please try again.");
      }
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Add Announcement</h1>
      {errorMessage && <div style={styles.error}>{errorMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Title</label>
          <input
            type="text"
            style={styles.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Content</label>
          <textarea
            style={styles.textarea}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Attachments (max 5 files)</label>
          <input
            type="file"
            style={styles.input}
            multiple
            onChange={handleFileChange}
            accept=".pdf,.png,.jpg,.jpeg"
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

export default AddAnnouncement;
