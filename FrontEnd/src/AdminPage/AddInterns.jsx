import React, { useEffect, useState } from "react";
import client from "../client"; // Import client.js untuk koneksi API
import axios from "axios";  // Import axios untuk koneksi API

const AddInterns = () => {
  const [userData, setUserData] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await client.get("/api/user/all");
        setUserData(response.data);
      } catch (err) {
        console.error("Error fetching user data", err);
        setError(err.response?.data?.message || "Failed to fetch user data.");
      }
    };

    fetchUserData();
  }, []);

  

  const updateVerificationStatus = async (internId) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/admin/${internId}`,
        {} // Body request jika diperlukan
      );
      console.log('Verification successful:', response.data);
    } catch (error) {
      console.error('Failed to update verification:', error);
    }
  };
  

  

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Interns</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Name & Email</th>
              <th style={styles.th}>Phone Number</th>
              <th style={styles.th}>Course</th>
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
                  <td style={styles.td}>Learning and Development</td>
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
                <td style={styles.td} colSpan="5">
                  No data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: "20px", backgroundColor: "#fff" },
  title: { fontSize: "24px", marginBottom: "20px" },
  tableWrapper: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { padding: "10px", backgroundColor: "#ddd", textAlign: "left" },
  td: { padding: "10px", borderBottom: "1px solid #ddd" },
  nameEmailContainer: { display: "flex", alignItems: "center", gap: "10px" },
  tableImage: { borderRadius: "50%", width: "30px", height: "30px" },
  button: { padding: "5px 10px", borderRadius: "3px", cursor: "pointer" },
  addButton: { backgroundColor: "#6c757d", color: "#fff", marginRight: "5px" },
  declineButton: { backgroundColor: "#888", color: "#fff" },
};

export default AddInterns;
