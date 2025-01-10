import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import client from "../client"; // Koneksi backend (axios instance)

const EditAnnouncement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Fetch announcement data
    const fetchAnnouncement = async () => {
      try {
        const response = await client.get(`/api/admin/announcement/${id}`);
        setTitle(response.data.title);
        setContent(response.data.description);
      } catch (error) {
        console.error("Error fetching announcement:", error);
        setErrorMessage("Failed to load announcement");
      }
    };
    fetchAnnouncement();
  }, [id]);
  

  const handleFileChange = (e) => {
    setAttachments(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", content);

    for (let i = 0; i < attachments.length; i++) {
      formData.append("attachments", attachments[i]);
    }

    try {
      await client.put(`/api/admin/announcement/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      navigate("/home");
    } catch (error) {
      console.error("Error updating announcement:", error);
      setErrorMessage("Failed to update announcement");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Edit Announcement</h1>
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
          <label style={styles.label}>New Attachments (max 5 files)</label>
          <input
            type="file"
            style={styles.input}
            multiple
            onChange={handleFileChange}
            accept=".pdf,.png,.jpg,.jpeg"
          />
        </div>
        <button style={styles.submitButton} type="submit">
          Update
        </button>
      </form>
    </div>
  );
};

// Gunakan styles yang sama dengan AddAnnouncement
