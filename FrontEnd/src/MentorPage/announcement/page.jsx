import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from "@client";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Fab,
  Button,
  InputBase,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  ChevronRight,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/layout';

const MotionPaper = motion.create(Paper);
const MotionFab = motion.create(Fab);

// Mock announcement data
const initialAnnouncements = [
  {
    id: 1,
    title: 'Perubahan jadwal masuk magang',
    admin: 'Admin Magang',
    date: '30 Oktober 2099',
  },
];

export default function AnnouncementPage() {
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Fetch announcements from the API
  const fetchAnnouncements = async () => {
    try {
      const response = await client.get(`api/announcement/allAnnouncement?title=${searchQuery}`);
      setAnnouncements(response.data.data);
      console.log('Announcements fetched:', response.data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, [searchQuery]); // Fetch announcements whenever the search query changes

  // useEffect(() => {
  //   console.log('Announcements updated:', announcements);
  // }, [announcements]);
  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this announcement?');
    if (confirmed) {
      try {
        await client.delete(`api/announcement/${id}/deleteAnnouncement`);
        setAnnouncements(prevAnnouncements => prevAnnouncements.filter(announcement => announcement._id !== id));
        alert('Announcement deleted successfully');
      } catch (error) {
        console.error('Error deleting announcement:', error);
      }
    }
  };


  const handleAddClick = () => {
    navigate('/homeMentor/announcements/create');
  };

  const handleEditClick = (id) => {
    navigate(`/homeMentor/announcements/edit/${id}`);
  };

  const handleViewClick = (id) => {
    navigate(`/homeMentor/announcements/${id}`);
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ p: 3, position: 'relative', minHeight: '100vh' }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 4
          }}>
            <Typography variant="h4">Announcement</Typography>
            <Paper
              sx={{
                p: '2px 4px',
                display: 'flex',
                alignItems: 'center',
                width: 400,
                borderRadius: '20px',
                backgroundColor: '#fff'
              }}
            >
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <IconButton sx={{ p: '10px' }}>
                <SearchIcon />
              </IconButton>
            </Paper>
          </Box>

          {/* Announcements List */}
          <AnimatePresence>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {announcements.map((announcement) => (
                <MotionPaper
                  key={announcement.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  sx={{
                    p: 2,
                    backgroundColor: '#ff7f7f',
                    color: 'white',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleViewClick(announcement._id)}
                >
                  <Box>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      {announcement.title}
                    </Typography>
                    <Typography variant="body2">
                      {announcement.createdBy?.roleType === 1 
                        ? `${announcement.createdBy.namaUser} (mentor), ${announcement.date}`
                        : announcement.createdBy?.roleType === 0 
                        ? `${announcement.createdBy.namaUser} (admin), ${announcement.date}`
                        : `${announcement.createdBy?.namaUser || 'Unknown User'}, ${announcement.date}`} {/* Fallback for undefined */}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <motion.div whileHover={{ scale: 1.05 }}>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          backgroundColor: '#4B0082',
                          '&:hover': {
                            backgroundColor: '#3B0062'
                          }
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(announcement._id);
                        }}
                      >
                        Edit
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }}>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          backgroundColor: '#FF0000',
                          '&:hover': {
                            backgroundColor: '#CC0000'
                          }
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(announcement._id);
                        }}
                      >
                        Delete
                      </Button>
                    </motion.div>
                    <IconButton sx={{ color: 'white' }}>
                      <ChevronRight />
                    </IconButton>
                  </Box>
                </MotionPaper>
              ))}
            </Box>
          </AnimatePresence>

          {/* Floating Add Button */}
          <Box
            sx={{
              position: 'fixed',
              bottom: 32,
              right: 32,
              backgroundColor: '#e0e0e0',
              borderRadius: '12px',
              p: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <MotionFab
              color="default"
              aria-label="add"
              onClick={handleAddClick}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              sx={{
                mb: 1,
                backgroundColor: '#e0e0e0',
                '&:hover': {
                  backgroundColor: '#d0d0d0'
                }
              }}
            >
              <AddIcon />
            </MotionFab>
            <Typography variant="caption">Add Announcement</Typography>
          </Box>
        </Box>
      </motion.div>
    </Layout>
  );
}