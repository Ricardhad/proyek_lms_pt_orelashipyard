import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  Typography,
  Avatar,
  Stack,
  Paper,
  Grid2 as Grid,
} from '@mui/material';
import Layout from '../components/layout';
import { useSelector,useDispatch } from 'react-redux';
import client from '../../client';// Import useDispatch
import { setUser } from "../../redux/authSlice"; // Import the setUser action
import * as jwtdecode from 'jwt-decode';// Default import
export default function Profile() {
  const token = localStorage.getItem("token");
  const user = useSelector((state) => state.auth.user);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await client.get(`api/anakMagang/${user.id}/Profile`); // Adjust the base URL if necessary
        setUserData(response.data);
        console.log("profile",userData);
      } catch (err) {
        setError(err.response?.data?.error || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user.id]);
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const profileData = {
    name: 'Esthera Jackson',
    email: 'esthera@simmple.com',
    school: 'SMAN 6',
    noWa: '08123456789',
    nrp: '123456789',
  };
  console.log("profile",userData);
  console.log("user",user);
  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>interns</Typography>
        <Paper sx={{ p: 4, backgroundColor: '#f5f5f5', borderRadius: '16px' }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Typography variant="h3" sx={{ mb: 2, fontWeight: 'bold' }}>
                  HI, I'm , {userData.user.namaUser}
                </Typography>
                 {/* <Typography
          variant="h2"
          sx={{
            fontWeight: 'bold',
            zIndex: 1,
            textAlign: 'center',
            mb: 2, // Add margin bottom for spacing
          }}
        >
          HI, Nama Intern{}
        </Typography> */}
                <Typography variant="h3" sx={{ mb: 2, fontWeight: 'bold'}}>
                  {userData.courses[0].namaCourse}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
            {/* <Avatar
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/User%20Intern%20Page-0oscu56Bk080b1fN7QeSgGNpjLSSmq.png"
              sx={{
                width: 180,
                height: 180,
                mx: 'auto',
                mb: 2,
                bgcolor: '#8B4513',
              }}
            /> */}
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Avatar
                  src={userData.user.Profile_Picture
                  }
                  alt="Mentor Profile"
                  sx={{
                    width: 250,
                    height: 250,
                    borderRadius: '50%',
                    border: '4px solid white',
                  }}
                />
              </Box>
              <Card
            sx={{
              p: 4,
              borderRadius: 4,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              bgcolor: 'white',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {/* <Avatar
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/User%20Intern%20Page-0oscu56Bk080b1fN7QeSgGNpjLSSmq.png"
              sx={{
                width: 180,
                height: 180,
                mx: 'auto',
                mb: 2,
                bgcolor: '#8B4513',
              }}
            /> */}
            <Box sx={{ mb: 2, textAlign: 'center' }}>
              <Typography variant="h5" sx={{ mb: 1, fontWeight: 'bold' }}>
                {userData.user.namaUser}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                {userData.user.email}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {userData.anakMagang.AsalSekolah}
              </Typography>
            </Box>
            <Stack
              direction="row"
              spacing={4}
              justifyContent="center"
              sx={{ mb: 1 }}
            >
              <Box sx={{ mb: 2, justifyContent: 'center' }}>
                <Typography variant="caption" color="text.secondary"sx={{alignItems: 'center' }}>
                  No Wa
                </Typography>
                <Typography variant="body2" sx={{alignItems: 'center' }}>{userData.user.noTelpon}</Typography>
              </Box>
              <Box sx={{ mb: 2, justifyContent: 'center' }}>
                <Typography variant="caption" color="text.secondary"sx={{alignItems: 'center' }}>
                  NRP
                </Typography>
                <Typography variant="body2"sx={{alignItems: 'center' }}>{profileData.nrp}</Typography>
              </Box>
            </Stack>
          </Card>
            </Grid>
          </Grid>
        </Paper>
      </Box>
      {/* <Box sx={{ height: '100vh', width: '100%', bgcolor: '#f5f5f5', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        
        <Typography
          variant="h2"
          sx={{
            fontWeight: 'bold',
            zIndex: 1,
            textAlign: 'center',
            mb: 2, // Add margin bottom for spacing
          }}
        >
          HI, Nama Intern{}
        </Typography>
        
        <Box
          sx={{
            width: '100%',
            maxWidth: 400,
            textAlign: 'center',
          }}
        >
          <Card
            sx={{
              p: 4,
              borderRadius: 4,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              bgcolor: 'white',
            }}
          >
            <Avatar
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/User%20Intern%20Page-0oscu56Bk080b1fN7QeSgGNpjLSSmq.png"
              sx={{
                width: 180,
                height: 180,
                mx: 'auto',
                mb: 2,
                bgcolor: '#8B4513',
              }}
            />
            <Typography variant="h5" sx={{ mb: 1, fontWeight: 'bold' }}>
              {profileData.name}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              {profileData.email}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {profileData.school}
            </Typography>
            <Stack
              direction="row"
              spacing={4}
              justifyContent="center"
              sx={{ mb: 1 }}
            >
              <Box>
                <Typography variant="caption" color="text.secondary">
                  No Wa
                </Typography>
                <Typography variant="body2">{profileData.noWa}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  NRP
                </Typography>
                <Typography variant="body2">{profileData.nrp}</Typography>
              </Box>
            </Stack>
          </Card>
        </Box>
      </Box> */}
    </Layout>
  );
}

