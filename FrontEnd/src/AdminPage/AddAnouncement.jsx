import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../client";

const AddAnnouncement = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Untuk menampilkan error
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi input sebelum submit
    if (!title.trim() || !content.trim()) {
      setErrorMessage("Title and content are required.");
      return;
    }

    try {
      // Data yang akan dikirim ke backend
      const payload = {
        title,
        content,
        author: "Admin Magang", // Ganti sesuai data user
        date: new Date().toISOString(), // Pastikan format tanggal sesuai
      };

      console.log("Payload being sent:", payload);

      // Kirim data ke backend
      await axios.post("/api/admin/announcements", payload);

      // Redirect ke halaman pengumuman
      navigate("/announcement");
    } catch (error) {
      console.error("Error adding announcement:", error);

      // Tampilkan pesan error jika tersedia dari backend
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
