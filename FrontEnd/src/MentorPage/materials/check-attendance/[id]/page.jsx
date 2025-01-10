import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar, Checkbox } from '@mui/material';
import Layout from '../../../components/layout';
import { Image } from '@mui/icons-material';

const interns = [
  {
    id: '123456789',
    name: 'Esthera Jackson',
    email: 'esthera@simmmple.com',
    phone: '08123456789',
    course: 'Learning and Development',
    avatar: '/placeholder.svg',
    isPresent: false, // Added field for attendance status
  },
  // Repeat intern data 6 more times for the example
];

export default function CheckAttendancePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Function to handle attendance checkbox change
  const handleAttendanceChange = (internId) => {
    const updatedInterns = interns.map((intern) =>
      intern.id === internId ? { ...intern, isPresent: !intern.isPresent } : intern
    );
    // Update the state or perform any other action with the updatedInterns
    console.log('Updated Attendance:', updatedInterns);
  };

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4 
        }}>
          <Typography variant="h4" sx={{ mb: 4 }}>ATTENDANCE {id}</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" sx={{ backgroundColor: '#e0e0e0', color: 'black' }} onClick={() => navigate(-1)}>
              Back
            </Button>
            <Button variant="contained" color="primary">
              Submit
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
            <Typography variant="h5" sx={{ mb: 2 }}>Attendance for Materi {id}</Typography>
            <Typography sx={{ mb: 2 }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography>DATE : </Typography>
              <Typography color="error">2023-10-31</Typography>
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
                  <TableCell>{intern.course}</TableCell>
                  <TableCell>
                    <Checkbox
                      checked={intern.isPresent}
                      onChange={() => handleAttendanceChange(intern.id)}
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
}