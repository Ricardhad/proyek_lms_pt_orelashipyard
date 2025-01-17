import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import client from '../client'; // Pastikan client axios sudah dikonfigurasi

export default function DetailMentor() {
  const { id } = useParams(); // Mendapatkan ID dari URL params
  const [mentorData, setMentorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [CoursesData, setCoursesData] = useState([]);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchMentorDetails = async () => {
      try {
        const response = await client.get(`/api/admin/detailmentor/${id}`);
        console.log('Mentor Data:', response.data); // Debugging untuk memeriksa data
        setMentorData(response.data.mentor);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch mentor details');
        setLoading(false);
      }
    };

    fetchMentorDetails();
  }, [id]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await client.get('/api/user/courses'); // Endpoint courses
        setCoursesData(response.data); // Pastikan response.data adalah array daftar kursus
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses.');
      }
    };

    fetchCourses();
  }, []);

  const handleConfirm = async () => {
    if (!selectedCourse) {
      alert('Please select a course.');
      return;
    }

    try {
      const response = await client.put(`/api/admin/updateMentorCourse/${id}`, {
        courseId: selectedCourse,
      });

      if (response.status === 200) {
        setSuccess('Course updated successfully!');
      }
    } catch (err) {
      console.error('Error updating course:', err);
      alert('Failed to update course.');
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">Mentor Details</h1>

        <div className="bg-gray-200 rounded-lg p-8 relative overflow-hidden">
  <div className="max-w-2xl">
    <div className="text-4xl mb-2">Hi, I'm</div>
    <div className="text-5xl font-bold mb-8">{mentorData.userID?.namaUser || 'No Name Available'}</div>
    <div
    className="absolute right-[-50px] top-[-50px] w-[200px] h-[200px] bg-blue-500 rounded-full flex items-center justify-center shadow-lg"
    style={{ border: '4px solid white' }}
  >
    <img
      src={mentorData.userID?.Profile_Picture || 'https://via.placeholder.com/150'}
      alt="Mentor profile"
      className="w-[90%] h-[90%] object-cover rounded-full"
    />
  </div>
  <br></br>
  <br></br>
  <br></br>
  <br></br>
  <br></br>
  <br></br>
  

    {/* Mentor Details */}
    <div className="space-y-4 text-lg">
      <DetailItem icon="👤" label="Name" value={mentorData.userID?.namaUser || 'No data available'} />
      <DetailItem icon="📧" label="Email" value={mentorData.userID?.email || 'No data available'} />
      <DetailItem icon="📱" label="Phone" value={mentorData.userID?.noTelpon || 'No data available'} />
      <DetailItem
        icon="📚"
        label="Courses"
        value={
          mentorData.courseID && mentorData.courseID.length > 0
            ? mentorData.courseID.map(course => course.namaCourse).join(', ')
            : 'No courses available'
        }
      />
    </div>

    {/* Add Course Section */}
    <div className="mt-8 space-y-4">
      <h3 className="text-xl font-bold">Add Mentor to Class</h3>
      <div className="mb-4">
        <label className="block text-lg font-medium">Select Course</label>
        <select
          className="w-full border p-2 mt-2"
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
        >
          <option value="">Select a course</option>
          {Array.isArray(CoursesData) && CoursesData.length > 0 ? (
            CoursesData.map(course => (
              <option key={course._id} value={course._id}>
                {course.namaCourse}
              </option>
            ))
          ) : (
            <option disabled>No courses available</option>
          )}
        </select>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          onClick={handleConfirm}
        >
          Add to Class
        </button>
      </div>

      {success && <div className="text-green-500 mt-4">{success}</div>}
    </div>
  </div>

  {/* Profile Image Circle */}
  
</div>

      </div>
    </div>
  );
}

// DetailItem Component
function DetailItem({ icon, label, value }) {
  return (
    <div className="flex items-center space-x-4">
      <span className="text-xl">{icon}</span>
      <div className="flex space-x-2">
        <span className="font-semibold">{label}:</span>
        <span>{value}</span>
      </div>
    </div>
  );
}
