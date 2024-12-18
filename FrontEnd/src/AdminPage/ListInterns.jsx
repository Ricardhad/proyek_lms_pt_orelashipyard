import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import client from "../client"; // Koneksi backend (axios instance)


const ListInterns = () => {
  const [interns, setInterns] = useState([]); // State untuk data interns
  const [filteredInterns, setFilteredInterns] = useState([]); // State untuk data setelah search
  const [searchQuery, setSearchQuery] = useState(""); // State untuk input search
  const [error, setError] = useState("");

  const navigate = useNavigate(); // Untuk navigasi ke halaman Edit

  // Fetch data dari backend saat komponen dimount
  useEffect(() => {
    const fetchInterns = async () => {
      try {
        const response = await client.get("/api/user/all");
        setInterns(response.data);
        setFilteredInterns(response.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data");
      }
    };
    fetchInterns();
  }, []);

  // Fungsi untuk handle pencarian
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = interns.filter((intern) =>
      intern.namaUser.toLowerCase().includes(query) ||
      intern.email.toLowerCase().includes(query)
    );

    setFilteredInterns(filtered);
  };

  // Fungsi untuk handle tombol Edit
  const handleEdit = (userId) => {
    navigate(`/edit/${userId}`); // Navigasi ke halaman Edit dengan userId
  };

  return (
    <div style={styles.container}>
      {/* Search Input */}
      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={handleSearch}
          style={styles.searchInput}
        />
        <span style={styles.searchIcon}>🔍</span>
      </div>

      {/* Title */}
      <h1 style={styles.title}>Interns</h1>

      {/* Error Handling */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Table */}
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
            {filteredInterns.length > 0 ? (
              filteredInterns.map((intern) => (
                <tr key={intern._id}>
                  <td style={styles.td}>{intern._id}</td>
                  <td style={styles.td}>
                    <div style={styles.nameEmailContainer}>
                      <img
                        src={
                          intern.Profile_Picture || "https://via.placeholder.com/30"
                        }
                        alt="Profile"
                        style={styles.profileImage}
                      />
                      <div>
                        <strong>{intern.namaUser}</strong>
                        <br />
                        <small>{intern.email}</small>
                      </div>
                    </div>
                  </td>
                  <td style={styles.td}>{intern.noTelpon}</td>
                  <td style={styles.td}>Learning and Development</td>
                  <td style={styles.td}>
                    <button
                      style={{ ...styles.button, ...styles.editButton }}
                      onClick={() => handleEdit(intern._id)} // Panggil handleEdit
                    >
                      Edit
                    </button>

                    <button
                      style={{ ...styles.button, ...styles.detailButton }}
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={styles.td}>
                  No data found.
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
  searchContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: "20px",
    position: "relative",
  },
  searchInput: {
    width: "100%",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  searchIcon: {
    position: "absolute",
    right: "10px",
    fontSize: "20px",
    pointerEvents: "none",
  },
  title: { fontSize: "24px", marginBottom: "10px" },
  tableWrapper: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { padding: "10px", backgroundColor: "#ddd", textAlign: "left" },
  td: { padding: "10px", borderBottom: "1px solid #ddd" },
  nameEmailContainer: { display: "flex", alignItems: "center", gap: "10px" },
  profileImage: { width: "30px", height: "30px", borderRadius: "50%" },
  button: {
    padding: "5px 10px",
    border: "none",
    borderRadius: "3px",
    cursor: "pointer",
    color: "#fff",
    marginRight: "5px",
  },
  editButton: { backgroundColor: "#6c757d" },
  detailButton: { backgroundColor: "#888" },
};

export default ListInterns;
