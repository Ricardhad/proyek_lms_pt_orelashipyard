import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../client"; // Pastikan ini mengarah ke instance Axios Anda

const Announcement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const navigate = useNavigate();

  // Mengambil data pengumuman dari backend
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get("/api/admin/announcements");
        setAnnouncements(response.data);
      } catch (error) {
        console.error("Error fetching announcements:", error);
      }
    };
    fetchAnnouncements();
  }, []);

  // Fungsi untuk menangani penghapusan pengumuman
  const handleDelete = async (announcementId) => {
    try {
      await axios.delete(`/admin/announcements/${announcementId}`);
      setAnnouncements((prev) =>
        prev.filter((announcement) => announcement._id !== announcementId)
      );
    } catch (error) {
      console.error("Error deleting announcement:", error);
    }
  };

  // Navigasi ke halaman AddAnnouncement
  const handleAddAnnouncement = () => {
    navigate("/addannouncement");
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Announcement</h1>
      <div>
        {announcements.map((announcement) => (
          <div key={announcement._id} style={styles.card}>
            <div style={styles.cardContent}>
              <h3>{announcement.title}</h3>
              <p style={styles.author}>
                {announcement.author} • {new Date(announcement.date).toLocaleDateString()}
              </p>
            </div>
            <div>
              <button
                style={styles.editButton}
                onClick={() => navigate(`/editannouncement/${announcement._id}`)}
              >
                Edit
              </button>
              <button
                style={styles.deleteButton}
                onClick={() => handleDelete(announcement._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      <button style={styles.addButton} onClick={handleAddAnnouncement}>
        +
      </button>
    </div>
  );
};

const styles = {
  container: {
    padding: "300px",
    backgroundColor: "#f9f9f9",
    minHeight: "100vh",
    position: "relative",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  card: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffdddd",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "10px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  cardContent: {
    flex: 1,
  },
  author: {
    color: "#555",
    fontSize: "14px",
  },
  editButton: {
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: "10px",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  addButton: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    padding: "15px",
    borderRadius: "50%",
    fontSize: "24px",
    cursor: "pointer",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
  },
};

export default Announcement;
