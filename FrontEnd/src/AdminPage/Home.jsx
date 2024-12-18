import React, { useState } from "react";
import AddInterns from "./AddInterns";
import ListInterns from "./ListInterns"; // Tambahkan komponen Interns

const Home = () => {
  const [currentPage, setCurrentPage] = useState("add-interns"); // State untuk mengatur halaman aktif

  // Fungsi untuk merender halaman berdasarkan state
  const renderPage = () => {
    switch (currentPage) {
      case "add-interns":
        return <AddInterns />;
      case "interns":
        return <ListInterns />;
      default:
        return <AddInterns />;
    }
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h2 style={styles.menuTitle}>Menu</h2>
        <ul style={styles.menuList}>
          <li style={styles.menuItem}>
            <span style={styles.link} onClick={() => setCurrentPage("add-interns")}>
              Add Interns
            </span>
          </li>
          <li style={styles.menuItem}>
            <span style={styles.link} onClick={() => setCurrentPage("interns")}>
              Interns
            </span>
          </li>
          <li style={styles.menuItem}>
            <span style={styles.link} onClick={() => setCurrentPage("mentors")}>
              Mentors
            </span>
          </li>
          <li style={styles.menuItem}>
            <span style={styles.link} onClick={() => setCurrentPage("courses")}>
              Courses
            </span>
          </li>
          <li style={styles.menuItem}>
            <span style={styles.link} onClick={() => setCurrentPage("schedule")}>
              Schedule
            </span>
          </li>
          <li style={styles.menuItem}>
            <span style={styles.link} onClick={() => setCurrentPage("add-announcement")}>
              Add Announcement
            </span>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>{renderPage()}</div>
    </div>
  );
};

const styles = {
  container: { display: "flex" },
  sidebar: {
    width: "250px",
    backgroundColor: "#f8f9fa",
    minHeight: "100vh",
    padding: "20px 10px",
    boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
    position: "fixed",   // Tambahkan ini
    top: 0,              // Posisi dari atas
    left: 0,             // Posisi dari kiri layar
  },
  
  menuTitle: { fontSize: "18px", marginBottom: "10px" },
  menuList: { listStyle: "none", padding: 0 },
  menuItem: { padding: "8px", cursor: "pointer", transition: "0.3s" },
  link: {
    textDecoration: "none",
    color: "black",
    fontSize: "16px",
    cursor: "pointer",
  },
  mainContent: {
    flexGrow: 1,
    padding: "20px",
    backgroundColor: "#ffffff",
    marginLeft: "250px",  // Sesuaikan dengan lebar sidebar
  },
  
};

export default Home;
