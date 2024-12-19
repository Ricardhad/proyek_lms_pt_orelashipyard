import React, { useState } from "react";
import client from "../client"; // Axios instance

const AddCourse = () => {
  const [formData, setFormData] = useState({
    name: "",
    desc: "",
    MentorID: "",
    daftarKelas: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const requestData = {
        ...formData,
        MentorID: formData.MentorID ? formData.MentorID.split(",") : [],
        daftarKelas: formData.daftarKelas ? formData.daftarKelas.split(",") : [],
      };

      const response = await client.post("/api/admin/Course", requestData);
      setMessage(`Course created: ${response.data.namaCourse}`);
      setFormData({ name: "", desc: "", MentorID: "", daftarKelas: "" });
    } catch (error) {
      console.error("Error creating course:", error);
      setMessage("Error creating course.");
    }
  };

  return (
    <div style={styles.container}>
      <h1>Add New Course</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="name"
          placeholder="Course Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <textarea
          name="desc"
          placeholder="Description"
          value={formData.desc}
          onChange={handleChange}
        />
        <input
          type="text"
          name="MentorID"
          placeholder="Mentor IDs (comma-separated)"
          value={formData.MentorID}
          onChange={handleChange}
        />
        <input
          type="text"
          name="daftarKelas"
          placeholder="Participant IDs (comma-separated)"
          value={formData.daftarKelas}
          onChange={handleChange}
        />
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

const styles = {
  container: { padding: "20px" },
  form: { display: "flex", flexDirection: "column", gap: "10px" },
};

export default AddCourse;
