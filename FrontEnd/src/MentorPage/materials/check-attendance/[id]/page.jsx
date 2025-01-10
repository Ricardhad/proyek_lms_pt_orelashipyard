import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar, Checkbox } from '@mui/material';
import Layout from '../../../components/layout';
import { Image } from '@mui/icons-material';
import axios from 'axios'; // Import Axios for making API calls

const CheckAttendancePage = () => {
  const { modulId } = useParams(); // Get the modulId from the URL
  const navigate = useNavigate();

  // State to store the fetched attendance data
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch attendance data when the component mounts
  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        // Call the API endpoint to get attendance data based on modulId
        const response = await axios.get(`http://localhost:3000/api/mentor/${modulId}/attendance`);
        setAttendanceData(response.data); // Update state with fetched data
        setLoading(false);
      } catch (err) {
        console.error('Error fetching attendance data:', err);
        if (err.response && err.response.status === 404) {
          setError('Attendance data not found for this module.');
        } else if (err.response && err.response.status === 500) {
          setError('Server error: Please try again later.');
        } else {
          setError('Failed to fetch attendance data');
        }
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, [modulId]);

  // Function to handle attendance checkbox change
  const handleAttendanceChange = (anakMagangID) => {
    const updatedAttendance = attendanceData.map((attendance) => {
      if (attendance.anakMagangID._id === anakMagangID) {
        return { ...attendance, isPresent: !attendance.isPresent };
      }
      return attendance;
    });
    setAttendanceData(updatedAttendance); // Update state with the new attendance status
  };

  // Display loading state
  if (loading) {
    return (
      <Layout>
        <Box sx={{ p: 3 }}>
          <Typography>Loading...</Typography>
        </Box>
      </Layout>
    );
  }

  // Display error state
  if (error) {
    return (
      <Layout>
        <Box sx={{ p: 3 }}>
          <Typography color="error">Error: {error}</Typography>
        </Box>
      </Layout>
    );
  }

  // Display the main content
  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ mb: 4 }}>ATTENDANCE</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" sx={{ backgroundColor: '#e0e0e0', color: 'black' }} onClick={() => navigate(-1)}>
              Back
            </Button>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 4, mb: 4 }}>
          <Paper
            sx={{
              width: 400,
              height: 250,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f0f0f0',
            }}
          >
            <Image sx={{ fontSize: 40 }} />
          </Paper>

          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>Attendance for Module {modulId}</Typography>
            <Typography sx={{ mb: 2 }}>Module description goes here.</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography>DATE : </Typography>
              <Typography color="error">{new Date().toLocaleDateString()}</Typography>
            </Box>
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
                <TableCell>Attendance</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attendanceData.map((attendance, index) => (
                <TableRow key={index}>
                  <TableCell>{attendance.anakMagangID._id}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar src={attendance.anakMagangID.avatar} />
                      <Box>
                        <Typography variant="subtitle2">{attendance.anakMagangID.name}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          {attendance.anakMagangID.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{attendance.anakMagangID.phone}</TableCell>
                  <TableCell>Course Name</TableCell>
                  <TableCell>
                    <Checkbox
                      checked={attendance.isPresent}
                      onChange={() => handleAttendanceChange(attendance.anakMagangID._id)}
                      color="primary"
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
};

export default CheckAttendancePage;