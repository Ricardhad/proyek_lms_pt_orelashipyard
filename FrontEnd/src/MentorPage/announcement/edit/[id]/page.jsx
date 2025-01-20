import { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import Layout from '../../../components/layout';
import { useNavigate, useParams } from 'react-router-dom';
import client from "@client";

const MotionPaper = motion.create(Paper);

export default function EditAnnouncementPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch announcement data
  useEffect(() => {
    const fetchAnnouncementData = async () => {
      try {
        const response = await client.get(`api/announcement/${id}/singleAnnouncement`);
        setAnnouncement(response.data.data);
        console.log('Announcement fetched:', response.data);
      } catch (err) {
        setError(err.response ? err.response.data.error : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncementData();
  }, [id]);

  // Handle form input changes
  const handleChange = (e) => {
    setAnnouncement({
      ...announcement,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await client.put(
        `api/announcement/${id}/editAnnouncement`,
        announcement
      );
      console.log('Announcement updated:', response.data);
      navigate(-1); // Go back to the previous page after successful update
    } catch (err) {
      console.error('Error updating announcement:', err);
      setError(err.response ? err.response.data.error : 'An error occurred');
    }
  };

  if (loading) {
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

  if (!announcement) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Typography>No announcement found.</Typography>
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
            <Typography variant="h4">Edit Announcement</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#e0e0e0',
                    color: 'black',
                    borderRadius: '20px',
                    textTransform: 'none',
                  }}
                  onClick={() => navigate(-1)}
                >
                  Back
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="contained"
                  sx={{
                    borderRadius: '20px',
                    textTransform: 'none',
                  }}
                  onClick={handleSubmit}
                >
                  Save Changes
                </Button>
              </motion.div>
            </Box>
          </Box>

          <Box sx={{ maxWidth: 800, mx: 'auto' }}>
            <MotionPaper
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              sx={{ p: 4 }}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <TextField
                  fullWidth
                  label="Title"
                  name="title"
                  variant="outlined"
                  value={announcement.title}
                  onChange={handleChange}
                  sx={{ mb: 3 }}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  variant="outlined"
                  multiline
                  rows={6}
                  value={announcement.description}
                  onChange={handleChange}
                  sx={{ mb: 3 }}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.6 }}
              >
                <TextField
                  fullWidth
                  label="Date"
                  name="date"
                  type="date"
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  value={announcement.date}
                  onChange={handleChange}
                  sx={{ mb: 3 }}
                />
              </motion.div>
            </MotionPaper>
          </Box>
        </Box>
      </motion.div>
    </Layout>
  );
}