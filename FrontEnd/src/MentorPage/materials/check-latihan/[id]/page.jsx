import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar } from '@mui/material';
import Layout from '../../../components/layout';
import { Image } from '@mui/icons-material';
import axios from 'axios';

export default function CheckLatihanPage() {
  const navigate = useNavigate();
  const {id} = useParams();
  const [interns, setInterns] = useState([]); // State to store interns data
  const [loading, setLoading] = useState(true);

  // Fetch interns data from the API
  useEffect(() => {
    const fetchInterns = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/mentor/nilai-modul/${id}`);
        console.log('Interns nilai Data:', response.data);

        const { data } = response;

        // Map the API response to match your existing format
        const formattedData = data.data.map((intern) => ({
          id: intern.anakMagangID?._id || 'N/A',
          name: intern.anakMagangID?.userID?.namaUser || 'N/A',
          email: intern.anakMagangID?.userID?.email || 'N/A',
          phone: intern.anakMagangID?.userID?.noTelpon || 'N/A',
          course: intern.modulID?.namaModul || 'N/A',
          avatar: intern.anakMagangID?.userID?.Profile_Picture || '/placeholder.svg',
          score: `${intern.nilai || 0}`,
        }));

        setInterns(formattedData); // Update the state with formatted data
      } catch (error) {
        console.error('Error fetching interns data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInterns();
  }, [id]);

  const handleCheck = (internId) => {
    navigate(`/homeMentor/materials/check-latihan/${id}/${internId}`);
  };

  if (loading) {
    return (
      <Layout>
        <Box sx={{ p: 3 }}>
          <Typography>Loading...</Typography>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4">MATERIAL {id}</Typography>
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
            <Typography variant="h5" sx={{ mb: 2 }}>Materi {id}</Typography>
            <Typography sx={{ mb: 2 }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography>DEADLINE: </Typography>
              <Typography color="error">12:30 pm</Typography>
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
                <TableCell>Action</TableCell>
                <TableCell>Score</TableCell>
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
                    <Button
                      variant="contained"
                      size="small"
                      sx={{ backgroundColor: '#e0e0e0', color: 'black' }}
                      onClick={() => handleCheck(intern.id)}
                    >
                      Check
                    </Button>
                  </TableCell>
                  <TableCell>{intern.score}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Layout>
  );
}
