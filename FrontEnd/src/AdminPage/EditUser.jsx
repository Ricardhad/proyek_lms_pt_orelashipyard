import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import client from "@client";// Menggunakan client.js

const EditUser = () => {
  const { userId } = useParams(); // Mendapatkan userId dari URL
  // console.log("User ID:", userId); // Debugging
  const navigate = useNavigate(); // Untuk navigasi
  const [formData, setFormData] = useState({
    namaUser: "",
    password: "",
    noTelpon: "",
    AsalSekolah: "",
    courseID: "",
  });
  const [CoursesData, setCoursesData] = useState([]); // Data courses
  const [error, setError] = useState("");
  // Fetch data user dan courses saat komponen di-mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await client.get(`/api/admin/${userId}/editUser`);
        const coursesResponse = await client.get("/api/admin/Course"); // Mengambil data courses
        // setFormData({
        //   namaUser: userResponse.data.namaUser || "",
        //   noTelpon: userResponse.data.noTelpon || "",
        //   AsalSekolah: userResponse.data.AsalSekolah || "",
        //   courseID: userResponse.data.courseID || "",
        // });
        setFormData(userResponse.data); // Mengatur data user
        setCoursesData(coursesResponse.data); // Mengatur data courses
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.response?.data?.message || "");
      }
    };
    fetchData();
  }, [userId]);
  console.log(formData); // Debugging
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await client.put(`/api/admin/${userId}/editUser`, formData);
      alert(response.data.message || "User updated successfully!");
      navigate("/home"); // Sesuaikan dengan rute halaman sebelumnya
    } catch (err) {
      console.error("Error updating user:", err);
      setError(err.response?.data?.message || "Failed to update user.");
    }
  };

  // Handle Back button
  const handleBack = () => {
    navigate(-1); // Kembali ke halaman sebelumnya
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h1 className="text-2xl font-bold mb-4">Edit User</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Nama User:</label>
            <input
              type="text"
              name="namaUser"
              value={formData.namaUser}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block font-medium">No Telepon:</label>
            <input
              type="text"
              name="noTelpon"
              value={formData.noTelpon}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block font-medium">Asal Sekolah:</label>
            <input
              type="text"
              name="AsalSekolah"
              value={formData.AsalSekolah}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block font-medium">Course:</label>
            <select
              name="courseID"
              value={formData.courseID}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">Select a course</option>
              {CoursesData.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.namaCourse} {/* Menampilkan namaCourse */}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Back
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
