import React, { useState, useEffect } from "react";
import client from "../client"; // Axios instance
import { useNavigate } from "react-router-dom";

const AddMentor = () => {
  const [formData, setFormData] = useState({
    namaUser: "",
    Profile_Picture: "",
    noTelpon: "",
    email: "",
    password: "",
    course: "", // Field untuk menyimpan course yang dipilih
  });
  const [courses, setCourses] = useState([]); // State untuk menyimpan daftar course
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Fetch daftar course dari backend saat komponen dimuat
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await client.get("/api/admin/Course"); // Panggil endpoint backend
        setCourses(response.data.courses); // Simpan daftar course di state
      } catch (error) {
        console.error("Error fetching courses:", error);
        setMessage("Failed to fetch courses. Please try again.");
      }
    };
    fetchCourses();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token"); // Ambil token dari local storage
      const requestData = {
        namaUser: formData.namaUser,
        Profile_Picture: formData.Profile_Picture,
        noTelpon: formData.noTelpon,
        email: formData.email,
        password: formData.password,
        course: formData.course, // Sertakan course dalam request
      };

      // Panggil API untuk menambahkan mentor
      const response = await client.post("/api/admin/Mentor", requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage(`Mentor added successfully: ${response.data.user.namaUser}`);
      setFormData({
        namaUser: "",
        Profile_Picture: "",
        noTelpon: "",
        email: "",
        password: "",
        course: "",
      });

      // Redirect ke halaman home setelah 2 detik
      setTimeout(() => {
        navigate("/home");
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
        <select
          name="course"
          value={formData.course}
          onChange={handleChange}
          style={styles.input}
          required
        >
          <option value="" disabled>
            Select a course
          </option>
          {courses.map((course) => (
            <option key={course._id} value={course.namaCourse}>
              {course.namaCourse}
            </option>
          ))}
        </select>
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
