import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import client from "@client";// Axios instance untuk koneksi ke backend

const EditMentor = () => {
  const { id } = useParams(); // Mengambil mentor ID dari URL
  const [CoursesData, setCoursesData] = useState([]); // Data kursus
  const navigate = useNavigate();

  const [mentorData, setMentorData] = useState({
    namaUser: '',
    noTelpon: '',
    password: '',
    Profile_Picture: '',
    courseIDs: [],
  });
  const [courses, setCourses] = useState([]); // Semua course untuk list pilihan
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Untuk menampilkan error

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await client.get('/api/user/courses');
        setCoursesData(response.data); // Assuming response.data contains the list of courses
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses.');
      }
    };

    const fetchMentorData = async () => {
      try {
        // Fetch mentor data berdasarkan ID
        const mentorResponse = await client.get(`/api/admin/mentors/${id}`);
        const mentor = mentorResponse.data.mentor;

        // Set initial mentor data
        setMentorData({
          namaUser: mentor.userID.namaUser || '',
          noTelpon: mentor.userID.noTelpon || '',
          password: '', // Kosongkan untuk mencegah penggantian password tanpa sengaja
          Profile_Picture: mentor.userID.Profile_Picture || '',
          courseIDs: mentor.courseID.map(course => course._id) || [], // Menyimpan courseIDs
        });

        setLoading(false);
      } catch (err) {
        console.error('Error fetching mentor data:', err);
        setError('Failed to load mentor data.');
        setLoading(false);
      }
    };

    fetchCourses();
    fetchMentorData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await client.put(`/api/admin/mentor/${id}`, mentorData);
      alert('Mentor updated successfully!');
      navigate('/home'); // Kembali ke halaman mentor setelah berhasil
    } catch (error) {
      console.error('Error updating mentor:', error);
      alert('Failed to update mentor.');
    }
  };

  if (loading) {
    return (
      <div className="text-center text-gray-500">
        <div className="spinner"></div> {/* Spinner untuk loading */}
        Loading...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Edit Mentor</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>} {/* Error message */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nama User */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Nama User</label>
          <input
            type="text"
            value={mentorData.namaUser}
            onChange={(e) => setMentorData({ ...mentorData, namaUser: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
            style={{colors:'white'}}
            required
          />

        </div>

        {/* No Telepon */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">No Telepon</label>
          <input
            type="text"
            value={mentorData.noTelpon}
            onChange={(e) => setMentorData({ ...mentorData, noTelpon: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Password</label>
          <input
            type="password"
            value={mentorData.password}
            onChange={(e) => setMentorData({ ...mentorData, password: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
          />
          <small className="text-gray-500">Kosongkan jika tidak ingin mengganti password.</small>
        </div>

        {/* Profile Picture */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Profile Picture URL</label>
          <input
            type="text"
            value={mentorData.Profile_Picture}
            onChange={(e) => setMentorData({ ...mentorData, Profile_Picture: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Course */}
        <div className="input-field">
          <label className="block text-gray-700 font-medium mb-1">Courses</label>
          <select
            multiple
            value={mentorData.courseIDs}
            onChange={(e) =>
              setMentorData({
                ...mentorData,
                courseIDs: Array.from(e.target.selectedOptions, (option) => option.value),
              })
            }
            className="w-full px-4 py-2 border rounded-lg"
          >
            {CoursesData.map((course) => (
              <option key={course._id} value={course._id}>
                {course.namaCourse}
              </option>
            ))}
          </select>
          <small className="text-gray-500">Pilih satu atau lebih course.</small>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Update Mentor
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditMentor;
