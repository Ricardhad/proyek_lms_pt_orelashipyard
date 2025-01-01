import React, { useState,useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import client from '../client';
import '../style.css';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    namaUser: '',
    Profile_Picture: '',
    roleType: '2', // Default: Anak Magang
    noTelpon: '',
    email: '',
    password: '',
    confirmPassword: '',
    course: '',
    asalSekolah: '',
  });
  const [CoursesData, setCoursesData] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await client.get('api/user/courses');
        setCoursesData(response.data); // Assuming response.data contains the list of courses
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses.');
      }
    };

    fetchCourses();
  }, []);
  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const { namaUser, Profile_Picture, roleType, noTelpon, email, password, confirmPassword } = formData;

    // Validate roleType (Only allow 1 or 2)
    if (roleType !== '1' && roleType !== '2') {
      setError('Invalid role type');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    // Debugging: Lihat isi formData sebelum request
    console.log('FormData:', formData);

    try {
      const response = await client.post('api/user/register', {
        namaUser: formData.namaUser,
        Profile_Picture: formData.Profile_Picture || null,
        roleType: parseInt(formData.roleType, 10), // Pastikan roleType adalah angka
        noTelpon: formData.noTelpon,
        email: formData.email,
        password: formData.password,
        course: formData.course,
        asalSekolah: formData.roleType === '2' ? formData.asalSekolah : undefined, // Only include if roleType is 2
      });

      console.log('Response:', response.data);
      setSuccess(response.data.message || 'Registration successful!');
      navigate('/');
    } catch (err) {
      console.error('Error:', err.response?.data?.message || err.message);
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="wrapper">
      <style>
      <style>
        {`
          body::before {
            content: "";
            position: absolute;
            width: 100%;
            height: 100%;
            background: url("https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MTB8fHxlbnwwfHx8fHw%3D");
            background-position: center;
            background-size: cover;
          }
        `}
      </style>
      </style>
      <form onSubmit={handleSubmit}>
        <h2>Register</h2>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <div className="input-field">
          <input
            type="text"
            name="namaUser"
            value={formData.namaUser}
            onChange={handleChange}
            required
          />
          <label>Enter your username</label>
        </div>
        <div className="input-field">
          <input
            type="text"
            name="Profile_Picture"
            value={formData.Profile_Picture}
            onChange={handleChange}
          />
          <label>Profile picture URL (optional)</label>
        </div>
        <div className="input-field">
          <select
            name="roleType"
            value={formData.roleType}
            onChange={handleChange}
            required
          >
            <option value="2">Anak Magang</option>
            <option value="1">Mentor</option>
          </select>
          <label>Select your role</label>
        </div>
        <div className="input-field">
          <select
            name="course" // Update to match the state property
            value={formData.course} // Ensure this matches the state
            onChange={handleChange}
            required
          >
            <option value="">Select a course</option>
            {CoursesData.map((course) => (
              <option key={course.namaCourse} value={course.namaCourse}>
                {course.namaCourse} {/* Assuming each course has an 'id' and 'namaCourse' */}
              </option>
            ))}
          </select>
          <label>Select a course</label>
        </div>
        <div className="input-field">
          <input
            type="text"
            name="noTelpon"
            value={formData.noTelpon}
            onChange={handleChange}
            required
          />
          <label>Enter your phone number</label>
        </div>
        <div className="input-field">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <label>Enter your email</label>
        </div>
        {formData.roleType === '2' && ( // Show asalSekolah input only if roleType is '2'
          <div className="input-field">
            <input
              type="text"
              name="asalSekolah"
              value={formData.asalSekolah}
              onChange={handleChange}
              required // Make it required
            />
            <label>Enter your school origin</label>
          </div>
        )}
        <div className="input-field">
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <label>Create your password</label>
        </div>
        <div className="input-field">
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <label>Confirm your password</label>
        </div>
        <button type="submit">Register</button>
        <div className="register">
          <p>
            Already have an account? <Link to="/">Login</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
