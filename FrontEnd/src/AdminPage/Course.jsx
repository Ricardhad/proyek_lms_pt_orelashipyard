import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import client from "../client"; // Axios instance

const Course = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  // Fetch data courses dari backend
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await client.get("/api/admin/courses");
        setCourses(response.data.courses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
  }, []);

  // Event saat tombol tambah ditekan
  const handleAddCourse = () => {
    navigate("/addcourse"); // Navigate to AddCourse page
  };

  return (
    <div style={styles.pageContainer}>
      <h1 style={styles.pageTitle}>Course</h1>
      <div style={styles.gridContainer}>
        {/* Render daftar course */}
        {courses.map((course) => (
          <div key={course._id} style={styles.card}>
            <div style={styles.cardImage}></div>
            <div style={styles.cardContent}>
              <h3 style={styles.courseTitle}>{course.namaCourse}</h3>
              <p style={styles.courseDescription}>{course.Deskripsi}</p>
            </div>
          </div>
        ))}
        {/* Tombol tambah (+) */}
        <div style={styles.addButtonContainer}>
          <button style={styles.addButton} onClick={handleAddCourse}>
            +
          </button>
        </div>
      </div>
    </div>
  );
};

// Styling
const styles = {
  pageContainer: {
    padding: "20px",
    backgroundColor: "#f9f9f9",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  pageTitle: {
    fontSize: "36px",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#333",
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px",
    width: "100%",
    maxWidth: "1200px",
  },
  card: {
    borderRadius: "10px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
    transition: "0.3s",
  },
  cardImage: {
    height: "150px",
    backgroundColor: "#e0e0e0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "50px",
    color: "#aaa",
  },
  cardContent: {
    padding: "15px",
    textAlign: "center",
  },
  courseTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "#333",
  },
  courseDescription: {
    fontSize: "14px",
    color: "#555",
  },
  addButtonContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  addButton: {
    backgroundColor: "#333",
    color: "#fff",
    fontSize: "36px",
    borderRadius: "10px",
    width: "100%",
    height: "100%",
    cursor: "pointer",
    border: "none",
    transition: "0.3s",
  },
};

export default Course;
