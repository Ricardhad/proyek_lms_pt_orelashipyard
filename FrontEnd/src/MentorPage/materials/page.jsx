import { Grid, Card, CardMedia, CardContent, Typography, Button, Box, Avatar } from '@mui/material';
import { AppBar, Toolbar, InputBase } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Add as AddIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import Layout from '../components/layout';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import { useSelector } from 'react-redux';
import client from "@client";

const MotionGrid = motion(Grid);
const MotionCard = motion(Card);

export default function MaterialsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const user = useSelector((state) => state.auth.user);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modulList, setModulList] = useState([]); // State to store fetched modul data

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await client.get(`api/mentor/${user.id}/Profile`);
        console.log('Profile:', response.data);
        setUserData(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user.id]);

  // Fetch modul data based on courseID
  useEffect(() => {
    if (userData?.mentor?.courseID?.[0]) {
      const fetchModulData = async () => {
        try {
          const courseID = userData.mentor.courseID[0];
          const response = await client.get(`api/mentor/modul/${courseID}`);
          console.log('Modul Data:', response.data.modulList);
          setModulList(response.data.modulList); // Set the fetched modul data
        } catch (err) {
          console.error('Error fetching modul data:', err);
          setError('Failed to fetch modul data');
        }
      };

      fetchModulData();
    }
  }, [userData]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Handle material click
  const handleMaterialClick = (material) => {
    const isTugas = material.soalID && material.soalID.length > 0;
    const isAttendance = material.absensiID !== null;

    if (isTugas) {
      navigate(`/homeMentor/materials/check-latihan/${material._id}`);
    } else if (isAttendance) {
      navigate(`/homeMentor/materials/check-attendance/${material._id}`);
    } else {
      console.log('Unknown material type');
    }
  };

  return (
    <Layout>
      <AppBar position="static" color="transparent" elevation={3}>
        <Toolbar>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search Name..."
              inputProps={{ 'aria-label': 'search' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Search>
        </Toolbar>
      </AppBar>
      <Typography variant="h4" sx={{ p: 3 }}>
        MATERIAL
      </Typography>
      <Grid container spacing={3} sx={{ p: 3 }}>
        {modulList.map((material, index) => {
          const isTugas = material.soalID && material.soalID.length > 0;
          const isAttendance = material.absensiID !== null;

          return (
            <MotionGrid
              item
              key={material._id} // Use _id from modulList
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <MotionCard
                sx={{ display: 'flex', height: '100%', cursor: 'pointer' }}
                onClick={() => handleMaterialClick(material)}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.2 }}
              >
                <CardMedia
                  component="img"
                  sx={{ width: 151 }}
                  image={material.gambar || '/placeholder.svg'} // Use gambar from modulList
                  // alt={material.namaModul} // Use namaModul from modulList
                />
                <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <CardContent sx={{ flex: '1 0 auto' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
                        <Avatar src={material.mentorID.Profile_Picture} sx={{ mr: 1 }} /> {/* Placeholder for mentor avatar */}
                      </motion.div>
                      <Typography variant="subtitle2">{material.mentorID.namaUser || 'Mentor Name'}</Typography>
                    </Box>
                    <Typography variant="h6">{material.namaModul}</Typography> {/* Use namaModul from modulList */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                      {/* Conditionally render Deadline */}
                      {!isAttendance && (
                        <Typography variant="body2" color="error">
                          Deadline {new Date(material.Deadline).toLocaleString()} {/* Format deadline */}
                        </Typography>
                      )}
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          size="small"
                          sx={{ backgroundColor: '#e0e0e0', color: 'black' }}
                        >
                          {isTugas ? 'Tugas' : isAttendance ? 'Attendance' : 'Other'} {/* Display type */}
                        </Button>
                      </motion.div>
                    </Box>
                  </CardContent>
                </Box>
              </MotionCard>
            </MotionGrid>
          );
        })}
        <Grid item xs={12} sm={6} md={4}>
          <Link to="/homeMentor/materials/add" style={{ textDecoration: 'none' }}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#e0e0e0',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: '#d0d0d0',
                },
              }}
            >
              <CardContent>
                <Box sx={{ textAlign: 'center' }}>
                  <AddIcon sx={{ fontSize: 48, mb: 1 }} />
                  <Typography>TAMBAH MATERI</Typography>
                </Box>
              </CardContent>
            </Card>
          </Link>
        </Grid>
      </Grid>
    </Layout>
  );
}

// Styled components
const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    width: '100%',
  },
}));

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: '#fff',
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));