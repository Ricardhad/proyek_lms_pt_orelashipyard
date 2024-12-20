import React, { useState, useEffect } from "react";
import AddInterns from "./AddInterns";
import ListInterns from "./ListInterns"; 
import Course from "./Course"; // Tambahkan komponen Course
import Announcement from "./Anounncement";
import Mentor from "./Mentor";
import client from "../client"; // Axios instance for API calls
import { useNavigate } from "react-router-dom"; // Untuk navigasi logout

const Home = () => {
  const [currentPage, setCurrentPage] = useState("add-interns");
  const [userName, setUserName] = useState(""); // State untuk menyimpan namaUser
  const navigate = useNavigate();

  // Fungsi untuk mengambil data user
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await client.get("/api/user/all"); // Endpoint untuk mendapatkan semua pengguna
        const users = response.data;

        // Contoh: Ambil pengguna pertama (atau sesuaikan dengan logika)
        if (users && users.length > 0) {
          setUserName(users[0].namaUser); // Mengambil namaUser pengguna pertama
        } else {
          console.warn("No users found");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setUserName("Guest"); // Default value jika gagal
      }
    };

    fetchUserData();
  }, []);

  // Fungsi logout
  const handleLogout = () => {
    // Hapus token atau sesi
    localStorage.removeItem("token"); // Sesuaikan dengan penyimpanan token
    navigate("/"); // Arahkan kembali ke halaman login
  };

  // Fungsi untuk merender halaman berdasarkan state
  const renderPage = () => {
    switch (currentPage) {
      case "add-interns":
        return <AddInterns />;
      case "interns":
        return <ListInterns />;
      case "courses":
        return <Course />;
      case "announcement":
        return <Announcement />; 
      case "mentors":
        return <Mentor />; 
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
            <span style={styles.link} onClick={() => setCurrentPage("announcement")}>
              Add Announcement
            </span>
          </li>
        </ul>

        {/* User Data di bawah menu */}
        <div style={styles.userData}>
          <h3 style={styles.userName}>Hello, {userName}!</h3>
          <button onClick={handleLogout} style={styles.logoutButton}>
            Logout
          </button>
        </div>
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
    position: "fixed",
    top: 0,
    left: 0,
  },
  menuTitle: { fontSize: "18px", marginBottom: "10px", color: "black" },
  menuList: { listStyle: "none", padding: 0 },
  menuItem: { padding: "8px", cursor: "pointer", transition: "0.3s" },
  link: {
    textDecoration: "none",
    color: "black",
    fontSize: "16px",
    cursor: "pointer",
  },
  userData: {
    marginTop: "20px",
    borderTop: "1px solid #ccc",
    paddingTop: "15px",
    textAlign: "center",
  },
  userName: {
    fontSize: "16px",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "#333",
  },
  logoutButton: {
    padding: "10px",
    fontSize: "14px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  mainContent: {
    flexGrow: 1,
    padding: "20px",
    backgroundColor: "#ffffff",
    marginLeft: "250px",
  },
};

export default Home;
