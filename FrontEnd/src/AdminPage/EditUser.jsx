import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import client from "../client"; // Menggunakan client.js

const EditUser = () => {
  const { userId } = useParams(); // Mendapatkan userId dari URL
  const navigate = useNavigate(); // Untuk navigasi setelah berhasil mengedit user
  const [formData, setFormData] = useState({
    namaUser: "",
    roletype: 0,
    password: "",
    noTelpon: "",
  });
  const [error, setError] = useState("");

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Menggunakan client.js untuk request ke backend
      const response = await client.put(`/api/admin/${userId}/editUser`, formData);

      // Alert sukses dan navigasi kembali ke halaman ListInterns
      alert(response.data.message || "User updated successfully!");
      navigate("/home"); // Sesuaikan dengan rute halaman ListInterns Anda
    } catch (err) {
      console.error("Error updating user:", err);
      setError(err.response?.data?.message || "Failed to update user.");
    }
  };

  return (
    <div style={styles.container}>
      <h1>Edit User</h1>
      {error && <p style={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <label>
          Nama User:
          <input
            type="text"
            name="namaUser"
            value={formData.namaUser}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Role Type:
          <select
            name="roletype"
            value={formData.roletype}
            onChange={handleChange}
          >
            <option value={0}>Admin</option>
            <option value={1}>Mentor</option>
            <option value={2}>Anak Magang</option>
          </select>
        </label>
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </label>
        <label>
          No Telpon:
          <input
            type="text"
            name="noTelpon"
            value={formData.noTelpon}
            onChange={handleChange}
          />
        </label>
        <button type="submit" style={styles.button}>
          Save
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: { padding: "20px", maxWidth: "400px", margin: "0 auto" },
  error: { color: "red", marginBottom: "10px" },
  form: { display: "flex", flexDirection: "column", gap: "10px" },
  button: { padding: "10px", backgroundColor: "blue", color: "white", border: "none", cursor: "pointer" },
};

export default EditUser;
