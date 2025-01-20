'use client'

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Button } from '@mui/material';
import { motion } from 'framer-motion';
import Layout from '../../components/layout';
import client from "@client";

const MotionPaper = motion.create(Paper);

// Mock function to fetch announcement data
// const fetchAnnouncementData = async (id) => {
//   // In a real application, this would be an API call
//   return {
//     id: id,
//     title: 'Perubahan jadwal masuk magang',
//     description: 'Jadwal masuk magang akan diubah mulai minggu depan. Mohon perhatikan perubahan ini dan sesuaikan jadwal Anda.',
//     admin: 'Admin Magang',
//     date: '2099-10-30',
//   };
// }

export default function ViewAnnouncementPage() {
  const navigate = useNavigate();
  const params = useParams();
  console.log(params.id);
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAnnouncement = async () => {
      try {
        const response = await client.get(`api/announcement/${params.id}/singleAnnouncement`);
        setAnnouncement(response.data.data);
        console.log('Announcement fetched:', response.data);
      } catch (err) {
        setError(err.response ? err.response.data.error : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    loadAnnouncement();
  }, [params.id]);

  // if (loading) {
  //   return (

  //       <Typography>Loading...</Typography>
  //   );
  // }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Typography color="error">{error}</Typography>
      </motion.div>
    );
  }

  // useEffect(() => {
  //   const loadAnnouncement = async () => {
  //     const data = await fetchAnnouncementData(params.id);
  //     setAnnouncement(data);
  //   };
  //   loadAnnouncement();
  // }, [params.id]);


  if (!announcement) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Typography>Loading...</Typography>
      </motion.div>
    );
  }

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4">View Announcement</Typography>
            <Button
              variant="contained"
              sx={{ 
                backgroundColor: '#e0e0e0', 
                color: 'black',
                borderRadius: '20px',
                textTransform: 'none'
              }}
              onClick={() => navigate(-1)}
            >
              Back
            </Button>
          </Box>

          <MotionPaper
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            sx={{ p: 4, backgroundColor: '#ff7f7f', color: 'white', borderRadius: '12px' }}
          >
            <Typography variant="h5" sx={{ mb: 2 }}>{announcement.title}</Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>{announcement.description}</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2">Created by: 
                {announcement.createdBy?.roleType === 1 
                  ? `${announcement.createdBy.namaUser} (mentor)`
                  : announcement.createdBy?.roleType === 0 
                  ? `${announcement.createdBy.namaUser} (admin)`
                  : `${announcement.createdBy?.namaUser || 'Unknown User'}`} {/* Fallback for undefined */}
              </Typography>
              <Typography variant="body2">Date: {announcement.date}</Typography>
            </Box>
          </MotionPaper>
        </Box>
      </motion.div>
    </Layout>
  );
}