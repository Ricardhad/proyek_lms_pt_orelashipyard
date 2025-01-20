import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "@client"; // Koneksi backend (axios instance)

const Announcement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const navigate = useNavigate();

  // Mengambil data pengumuman dari backend
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await client.get("/api/admin/announcements"); // Use client instead of axios
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
    await client.delete(`/api/admin/announcement/${announcementId}`); // Use client instead of axios
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
      <div style={styles.announcementList}>
        {announcements.map((announcement) => (
          <div key={announcement._id} style={styles.card}>
            <div style={styles.cardContent}>
              <h3 style={styles.announcementTitle}>{announcement.title}</h3>
              <p style={styles.authorDate}>
                {announcement.author} •{" "}
                {new Date(announcement.date).toLocaleDateString()}
              </p>
            </div>
            <div style={styles.cardActions}>
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
        Add Announcement
      </button>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    maxWidth: "800px",
    margin: "0 auto",
    backgroundColor: "#f9f9f9",
    minHeight: "100vh",
    position: "relative",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "20px",
    textAlign: "center",
  },
  announcementList: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  card: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffe5e5",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
  },
  cardContent: {
    flex: 1,
  },
  announcementTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "5px",
  },
  authorDate: {
    color: "#666",
    fontSize: "14px",
  },
  cardActions: {
    display: "flex",
    gap: "10px",
  },
  editButton: {
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "5px",
    cursor: "pointer",
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
    padding: "12px 20px",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
  },
};

export default Announcement;
