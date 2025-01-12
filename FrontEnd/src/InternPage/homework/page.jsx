'use client';

import React, { useEffect, useState } from 'react';
import Layout from '../components/layout';
import {
  Box,
  Card,
  Typography,
  Avatar,
  Stack,
  Chip,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Homework() {
  const user = useSelector((state) => state.auth.user);
  const [userData, setUserData] = useState(null);
  const [modulList, setModulList] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modulnotfound, setModulnotfound] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user profile data
        const response = await axios.get(`http://localhost:3000/api/anakMagang/${user.id}/Profile`);
        const profileData = response.data;

        if (profileData?.courses?.length > 0) {
          setUserData(profileData);

          // Fetch modul data for the first course
          const firstCourseId = profileData.courses[0]._id;

          try {
            const modulResponse = await axios.get(
              `http://localhost:3000/api/anakMagang/modul/${firstCourseId}/getallmodul`
            );
            const modulData = modulResponse.data.modulList;

            if (Array.isArray(modulData)) {
              setModulList(modulData);
            } else {
              setError("Invalid data format for modul list.");
            }
          } catch (modulError) {
            console.error("Error fetching modul data:", modulError);
            setError(modulError.response?.data?.error || "Error fetching modul data");
          }
        } else {
          setError("No courses found for the user.");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(err.response?.data?.error || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user.id]);

  useEffect(() => {
    console.log('modulList:', modulList);
  }, [modulList]);

  const handleMaterialClick = (modul) => {
    if (modul.soalID && modul.soalID.length > 0) {
      navigate(`/homeMagang/materials/${modul._id}/form`); // Tugas
    } else {
      navigate(`/homeMagang/materials/${modul._id}/attendance`); // Attendance
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;


  return (
    <Layout>
      <Box sx={{ p: 4 }}>
        <Typography variant="h2" sx={{ mb: 4, fontWeight: 'bold', textAlign: 'center' , color: 'darkblue'}}>
          Home Work
        </Typography>

        <Stack spacing={3}>
        {modulList.map((modul) => (
            <Card
              key={modul._id}
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                p: 2,
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                },
              }}
              onClick={() => handleMaterialClick(modul)} // Use the click handler
            >
              {/* Placeholder for Image */}
              <Box
                sx={{
                  width: { xs: '100%', sm: 200 },
                  height: 150,
                  bgcolor: 'grey.200',
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Typography color="text.secondary">Image</Typography>
              </Box>

              {/* Modul Details */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 1,
                    flexWrap: 'wrap',
                    gap: 1,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mr: 'auto' }}>
                    <Avatar
                      src="/placeholder.svg"
                      sx={{ width: 24, height: 24, mr: 1 }}
                    />
                    <Typography variant="subtitle2">{modul.mentorID || 'Unknown Mentor'}</Typography>
                  </Box>
                </Box>

                <Typography variant="h6" gutterBottom>
                  {modul.namaModul}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 'auto' }}>
                  <Typography
                    color="error.main"
                    variant="caption"
                    sx={{ fontWeight: 'medium' }}
                  >
                    Deadline: {new Date(modul.Deadline).toLocaleString() || 'N/A'}
                  </Typography>
                  <Chip
                    label={modul.soalID && modul.soalID.length > 0 ? 'Tugas' : 'Attendance'}
                    size="small"
                    color={modul.soalID && modul.soalID.length > 0 ? 'primary' : 'secondary'}
                    sx={{
                      bgcolor: modul.soalID && modul.soalID.length > 0
                        ? 'rgba(25, 118, 210, 0.1)' // Blue for 'Tugas'
                        : 'rgba(76, 175, 80, 0.1)', // Green for 'Attendance'
                      borderRadius: 1,
                    }}
                  />
                </Box>
              </Box>
            </Card>
          ))}
        </Stack>
      </Box>
    </Layout>
  );
}
