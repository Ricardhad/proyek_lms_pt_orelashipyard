import { Box, Button, TextField, Typography, Paper, Link } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '../../components/layout';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import client from "@client";

const MotionPaper = motion.create(Paper);

export default function CreateAnnouncementPage() {
  const navigate = useNavigate();
  // const token = localStorage.getItem("token");
  const user = useSelector((state) => state.auth.user);
  // console.log("token",user);
  const [attachments, setAttachments] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Set default date to today
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleFileChange = (event) => {
    const files = event.target.files;
    const newAttachments = Array.from(files).map(file => ({
      name: file.name,
      url: URL.createObjectURL(file), // Create a URL for the PDF
    }));
    setAttachments(prev => [...prev, ...newAttachments]);
  };

  
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('userID', user.id); // Updated to match your backend
  
    attachments.forEach(file => {
      const rawFile = file; // Use the file object instead of the URL
      formData.append('attachments', rawFile);
    });
  
    try {
      const response = await client.post('api/announcement/createannouncement', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Announcement created:', response.data);
      navigate(-1); // Redirect to the announcements page after success
    } catch (error) {
      console.error('Error creating announcement:', error);
    }
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4">Create Announcement</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="contained" 
                  sx={{ 
                    borderRadius: '20px',
                    textTransform: 'none'
                  }}
                  onClick={handleSubmit} // Call the API on click
                >
                  Submit
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
                  variant="outlined"
                  sx={{ mb: 3 }}
                  value={title} // Bind to state
                  onChange={(e) => setTitle(e.target.value)} // Update state on change
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
                  variant="outlined"
                  multiline
                  rows={6}
                  sx={{ mb: 3 }}
                  value={description} // Bind to state
                  onChange={(e) => setDescription(e.target.value)} // Update state on change
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
                  type="date"
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  value={date} // Set the value of the date input
                  onChange={(e) => setDate(e.target.value)} // Update state on change
                  sx={{ mb: 3 }}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.6 }}
              >
                <Paper sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Upload Files
                  </Typography>
                  <input
                    accept="application/pdf" // Set accepted file types if needed
                    style={{ display: 'none' }}
                    id="file-upload"
                    type="file"
                    multiple
                    onChange={handleFileChange}
                  />
                  <label htmlFor="file-upload">
                    <Button variant="contained" component="span" sx={{ mb: 2 }}>
                      Choose Files
                    </Button>
                  </label>
                  <Box>
                    {attachments.length > 0 && (
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        Selected Files:
                      </Typography>
                    )}
                    {attachments.map((file, index) => (
                      <Link
                        key={index}
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ display: 'block', mb: 1 }}
                      >
                        {file.name}
                      </Link>
                    ))}
                  </Box>
                </Paper>
              </motion.div>
            </MotionPaper>
          </Box>
        </Box>
      </motion.div>
    </Layout>
  );
}