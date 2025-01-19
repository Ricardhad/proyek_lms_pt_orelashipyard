import React, { useState } from "react";
import client from "../client";

const Test = () => {
  const [formData, setFormData] = useState({
    namaUser: "",
    Profile_Picture: "",
    roleType: "2", // Default: Anak Magang
    noTelpon: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const { namaUser, Profile_Picture, roleType, noTelpon, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    try {
      const response = await client.post("api/user/register", {
        namaUser,
        Profile_Picture: Profile_Picture || null,
        roleType: parseInt(roleType, 10),
        noTelpon,
        email,
        password,
      });
      setMessage(response.data.message || "Registration successful!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="wrapper">
      <h2>All Users</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="namaUser"
            value={formData.namaUser}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Profile Picture (URL):</label>
          <input
            type="text"
            name="Profile_Picture"
            value={formData.Profile_Picture}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Role Type:</label>
          <select
            name="roleType"
            value={formData.roleType}
            onChange={handleChange}
          >
            <option value="2">Anak Magang</option>
            <option value="1">Mentor</option>
          </select>
        </div>
        <div>
          <label>Phone Number:</label>
          <input
            type="text"
            name="noTelpon"
            value={formData.noTelpon}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Confirm Password:</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Test;
