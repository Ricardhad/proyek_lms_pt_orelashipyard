import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Checkbox,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Image, Add } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import Layout from '../../../components/layout';
import { setMaterial } from '../../../../redux/materialSlice'; // Import the action

export default function AttendancePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [interns, setInterns] = useState([]); // State for fetched interns
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const user = useSelector((state) => state.auth.user); // Get logged-in user from Redux
  const material = useSelector((state) => state.material); // Get material state from Redux

  // Fetch interns when the component mounts or searchQuery changes
  useEffect(() => {
    const fetchInterns = async () => {
      try {
        // Fetch mentor profile to get courseID
        const mentorResponse = await axios.get(`http://localhost:3000/api/mentor/${user.id}/Profile`);
        const courseID = mentorResponse.data.mentor.courseID[0];

        // Fetch interns for the course
        const params = searchQuery ? { namaUser: searchQuery } : {};
        const internsResponse = await axios.get(`http://localhost:3000/api/Mentor/${courseID}/AnakMagang`, { params });

        // Format interns data
        const formattedInterns = internsResponse.data.anakMagang.map((intern) => ({
          id: intern._id,
          name: intern.userID.namaUser,
          email: intern.userID.email || 'N/A',
          phone: intern.userID.noTelpon,
          course: {
            id: intern.course.id,
            namaCourse: intern.course.namaCourse,
            deskripsi: intern.course.deskripsi,
            mentorID: intern.course.mentorID,
          },
          avatar: intern.userID.Profile_Picture || '/placeholder.svg',
          isPresent: false, // Default attendance status
        }));

        setInterns(formattedInterns);
      } catch (error) {
        console.error('Error fetching interns:', error);
      }
    };

    fetchInterns();
  }, [user.id, searchQuery]);

  // Handle attendance checkbox toggle
  const handleToggleAttendance = (id) => {
    setInterns((prevInterns) =>
      prevInterns.map((intern) =>
        intern.id === id ? { ...intern, isPresent: !intern.isPresent } : intern
      )
    );
  };
    const handleChange = (e) => {
      const { name, value } = e.target;
      dispatch(setMaterial({ [name]: value }));
    };

  // Handle attendance submission
  const handleSubmit = async () => {
    try {
      // Prepare attendance data for submission
      const attendanceData = interns.map((intern) => ({
        anakMagangID: intern.id,
        isPresent: intern.isPresent,
      }));

      // Submit attendance data to the backend
      const response = await axios.post('/api/materials/attendance', {
        courseID: interns[0]?.course.id, // Assuming all interns belong to the same course
        tanggalAbsensi: new Date().toISOString(), // Use current date as attendance date
        absensiKelas: attendanceData,
      });

      console.log('Attendance submitted successfully:', response.data);
      alert('Attendance submitted successfully!');
    } catch (error) {
      console.error('Error submitting attendance:', error.response?.data || error.message);
      alert('Error submitting attendance. Please try again.');
    }
  };

  // Handle image drop
  const handleImageDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files[0] || e.target.files[0];

    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Update the material state with the image preview
        dispatch(setMaterial({ imagePreview: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle drag over
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              sx={{ backgroundColor: '#e0e0e0', color: 'black' }}
              onClick={() => navigate(-1)}
            >
              Back
            </Button>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </Box>
        </Box>
        <Typography variant="h4" sx={{ textAlign: 'center' }}>
          ABSENSI
        </Typography>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between' }}>
          {/* Image Upload Box */}
          <Box
            component="label"
            htmlFor="image-upload"
            sx={{
              border: '2px dashed #ccc',
              borderRadius: 1,
              p: 3,
              textAlign: 'center',
              width: 400, // Increased width
              height: 225, // Adjusted height for 16:9 aspect ratio
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative',
              backgroundColor: '#f0f0f0',
              '&:hover': {
                borderColor: '#666',
              },
            }}
            onDrop={handleImageDrop}
            onDragOver={handleDragOver}
          >
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageDrop}
            />
            {material.imagePreview ? (
              <Box
                sx={{
                  width: '100%',
                  height: '200px',
                  backgroundImage: `url(${material.imagePreview})`,
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
              />
            ) : (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
                  <Image sx={{ fontSize: 48, color: '#666' }} />
                </Box>
                <Typography>Drop your image here or browse</Typography>
              </>
            )}
          </Box>

          {/* Keep the rest of the code unchanged */}
          <Box>
            <TextField
              fullWidth
              label="JUDUL"
              variant="outlined"
              name="namaModul"
              value={material.namaModul || ''}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="DESKRIPSI"
              name="Deskripsi"
              value={material.Deskripsi || ''}
              onChange={handleChange}
              variant="outlined"
              multiline
              rows={4}
              sx={{ mb: 2 }}
            />
          </Box>
        </Box>

        <TableContainer component={Paper} sx={{ backgroundColor: '#f5f5f5' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#e0e0e0' }}>
                <TableCell>ID</TableCell>
                <TableCell>Name & Email</TableCell>
                <TableCell>Phone Number</TableCell>
                <TableCell>Course</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {interns.map((intern, index) => (
                <TableRow key={index}>
                  <TableCell>{intern.id}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar src={intern.avatar} />
                      <Box>
                        <Typography variant="subtitle2">{intern.name}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          {intern.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{intern.phone}</TableCell>
                  <TableCell>{intern.course.namaCourse}</TableCell> {/* Render namaCourse */}
                  <TableCell>
                    <Checkbox
                      checked={intern.isPresent}
                      onChange={() => handleToggleAttendance(intern.id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Layout>
  );
}