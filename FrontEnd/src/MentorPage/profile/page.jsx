'use client'
import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Avatar, Grid2 as Grid } from '@mui/material'
import Layout from '../components/layout'
import { useSelector } from 'react-redux';
import axios from 'axios';

export default function ProfilePage() {
  const token = localStorage.getItem("token");
  const user = useSelector((state) => state.auth.user);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/Mentor/${user.id}/Profile`); // Adjust the base URL if necessary
        console.log("profile",response.data);
        setUserData(response.data);
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
  // console.log("kontol",userData.user.namaUser)
  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>Mentors</Typography>
        <Paper sx={{ p: 4, backgroundColor: '#f5f5f5', borderRadius: '16px' }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Typography variant="h3" sx={{ mb: 2, fontWeight: 'bold' }}>
                  HI, I'm , {userData.user.
    namaUser}
                </Typography>
                <Typography variant="h3" sx={{ mb: 2, fontWeight: 'bold' }}>
                  {userData.courses[0].namaCourse}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Avatar
                  src={userData.user.Profile_Picture
                  }
                  alt="Mentor Profile"
                  sx={{
                    width: 300,
                    height: 300,
                    borderRadius: '50%',
                    border: '4px solid white',
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Layout>
  )
}

