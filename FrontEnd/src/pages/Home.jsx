import React, { useEffect, useState } from "react";
import client from "../client"; // Import client.js

const Home = () => {
  const [userData, setUserData] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await client.get("/api/user/all"); // Use client instance for API call
        console.log(response.data); // Check data received
        setUserData(response.data);
      } catch (err) {
        console.error("Error fetching user data", err);
        setError(err.response?.data?.message || "Failed to fetch user data.");
      }
    };

    fetchUserData();
  }, []);

  // Function to update verification status
  const updateVerificationStatus = async (userId, isVerified) => {
    try {
      console.log("Updating user verification status:");
      console.log("User ID:", userId);
      console.log("Is Verified:", isVerified);

      const token = localStorage.getItem("token");
      if (!token) {
        setError("You are not authorized. Please log in.");
        return;
      }

      // Send PUT request with proper headers and JSON body
      const response = await client.put(
        `/api/admin/${userId}/verify`,
        { isVerified: true },
        {
          headers: {
            'Authorization': `Bearer ${token}`, // Ensure the token is correct here
          },
        }
      );

      console.log("Response:", response.data); // Check the response from the backend
    } catch (err) {
      console.error("Error updating verification status:", err);
      setError(err.response?.data?.message || "Failed to update verification status.");
    }
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.profileSection}>
          <img
            src="https://via.placeholder.com/50"
            alt="Profile"
            style={styles.profileImage}
          />
        </div>
        <ul style={styles.menuList}>
          <li style={styles.menuItem}>👥 Interns</li>
          <li style={styles.menuItem}>👤 Mentors</li>
          <li style={styles.menuItem}>📖 Courses</li>
          <li style={styles.menuItem}>📅 Schedule</li>
          <li style={styles.menuItem}>➕ Add Announcement</li>
        </ul>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <h1 style={styles.title}>Interns</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Name & Email</th>
                <th style={styles.th}>Phone Number</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {userData.length > 0 ? (
                userData.map((user) => (
                  <tr key={user._id}>
                    <td style={styles.td}>{user._id}</td>
                    <td style={styles.td}>
                      <div style={styles.nameEmailContainer}>
                        <img
                          src={user.Profile_Picture || "https://via.placeholder.com/30"}
                          alt="Profile"
                          style={styles.tableImage}
                        />
                        <div>
                          <strong>{user.namaUser}</strong>
                          <br />
                          <small>{user.email}</small>
                        </div>
                      </div>
                    </td>
                    <td style={styles.td}>{user.noTelpon}</td>
                    <td style={styles.td}>
                      <button
                        style={{ ...styles.button, ...styles.addButton }}
                        onClick={() => updateVerificationStatus(user._id, true)}
                      >
                        Add
                      </button>
                      <button
                        style={{ ...styles.button, ...styles.declineButton }}
                        onClick={() => updateVerificationStatus(user._id, false)}
                      >
                        Decline
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td style={styles.td} colSpan="4">
                    No data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
  },
  sidebar: {
    width: "250px",
    backgroundColor: "#f8f9fa",
    minHeight: "100vh",
    padding: "20px 10px",
    boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
  },
  profileSection: {
    textAlign: "center",
    marginBottom: "20px",
  },
  profileImage: {
    borderRadius: "50%",
    width: "60px",
    height: "60px",
  },
  menuList: {
    listStyle: "none",
    padding: 0,
  },
  menuItem: {
    padding: "10px 15px",
    margin: "5px 0",
    cursor: "pointer",
    fontSize: "16px",
    borderRadius: "5px",
    transition: "background-color 0.3s",
  },
  mainContent: {
    flexGrow: 1,
    padding: "20px",
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: "24px",
    marginBottom: "20px",
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  },
  th: {
    padding: "10px",
    backgroundColor: "#f1f1f1",
    border: "1px solid #ddd",
  },
  td: {
    padding: "10px",
    border: "1px solid #ddd",
  },
  nameEmailContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  tableImage: {
    borderRadius: "50%",
    width: "30px",
    height: "30px",
  },
  button: {
    padding: "5px 10px",
    border: "none",
    borderRadius: "3px",
    cursor: "pointer",
    margin: "0 5px",
    zIndex: "1", // Make sure button is above other elements
  },
  addButton: {
    backgroundColor: "#28a745",
    color: "#ffffff",
  },
  declineButton: {
    backgroundColor: "#dc3545",
    color: "#ffffff",
  },
  buttonHover: {
    opacity: 0.8,
  },
};

export default Home;
