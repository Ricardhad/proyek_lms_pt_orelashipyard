import React, { useState } from "react";
import client from "../client"; // Axios instance
import { useNavigate } from "react-router-dom";

const AddMentor = () => {
  const [formData, setFormData] = useState({
    namaUser: "",
    Profile_Picture: "",
    noTelpon: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Prepare data for submission
      const requestData = {
        namaUser: formData.namaUser,
        Profile_Picture: formData.Profile_Picture,
        noTelpon: formData.noTelpon,
        email: formData.email,
        password: formData.password, // Pastikan password di-hash di backend
      };

      // Make API call to create mentor
      const response = await client.post("/api/user/create", requestData);
      setMessage(`Mentor added successfully: ${response.data.user.namaUser}`);

      // Reset form
      setFormData({
        namaUser: "",
        Profile_Picture: "",
        noTelpon: "",
        email: "",
        password: "",
      });

      // Navigate to mentor list page after success
      setTimeout(() => {
        navigate("/mentors");
      }, 2000);
    } catch (error) {
      console.error("Error adding mentor:", error);
      setMessage("Failed to add mentor. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Add New Mentor</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="namaUser"
          placeholder="Full Name"
          value={formData.namaUser}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <input
          type="text"
          name="Profile_Picture"
          placeholder="Profile Picture URL"
          value={formData.Profile_Picture}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          type="text"
          name="noTelpon"
          placeholder="Phone Number"
          value={formData.noTelpon}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <button type="submit" style={styles.button}>
          Submit
        </button>
      </form>
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
};

// Styling
const styles = {
  container: {
    padding: "20px",
    maxWidth: "500px",
    margin: "0 auto",
    textAlign: "center",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px",
    fontSize: "16px",
    backgroundColor: "#333",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  message: {
    marginTop: "20px",
    fontSize: "14px",
    color: "green",
  },
};

export default AddMentor;
