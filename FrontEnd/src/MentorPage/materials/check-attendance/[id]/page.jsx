import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, Typography, Paper, Button, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Avatar, Checkbox 
} from '@mui/material';
import Layout from '../../../components/layout';
import { Image } from '@mui/icons-material';
import client from "@client";

const CheckAttendancePage = () => {
  const { id } = useParams(); // Get the modulId from the URL
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
        const response = await client.get(`api/mentor/${id}/attendance`);
        console.log('Response received:', response.data);
        setAttendanceData(response.data); // Update state with fetched data
        setLoading(false);
      } catch (err) {
        console.error('Error fetching attendance data:', err);
        if (err.response && err.response.status === 404) {
          setError('Attendance data not found for this module.');
        } else if (err.response && err.response.status === 500) {
          setError('Server error: Please try again later.');
        } else {
          setError('Failed to fetch attendance data.');
        }
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, [id]);

  useEffect(() => {
    console.log('Attendance data:', attendanceData);
  })
  // Function to handle attendance checkbox change


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
            <Typography variant="h5" sx={{ mb: 2 }}>Attendance {attendanceData[0].modulID.namaModul}</Typography>
            <Typography sx={{ mb: 2 }}>{attendanceData[0].modulID.Deskripsi}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography>DATE : </Typography>
              <Typography color="error">{attendanceData[0].createdAt
              }</Typography>
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
                <TableCell>AsalSekolah</TableCell>
                <TableCell>Course</TableCell>
                <TableCell>Attendance</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attendanceData[0].absensiKelas.map((attendance, index) => (
                <TableRow key={index}>
                  <TableCell>{attendance.anakMagangID?._id || 'N/A'}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar src={attendance.anakMagangID?.userID?.Profile_Picture || ''} />
                      <Box>
                        <Typography variant="subtitle2">
                          {attendance.anakMagangID?.userID?.namaUser || 'Unknown'}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {attendance.anakMagangID?.userID?.email || 'No Email'}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{attendance.anakMagangID?.userID?.noTelpon || 'No Phone'}</TableCell>
                  <TableCell>{attendance.anakMagangID?.AsalSekolah || 'No Course'}</TableCell>
                  <TableCell>{attendance.anakMagangID?.courseID?.namaCourse || 'No Course'}</TableCell>
                  <TableCell>
                    <Checkbox
                      checked={attendance.isPresent || false}
                      color="primary"
                      disabled={!attendance.anakMagangID} // Disable checkbox if data is incomplete
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
