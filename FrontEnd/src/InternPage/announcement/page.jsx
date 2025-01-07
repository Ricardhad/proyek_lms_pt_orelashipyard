import {useState,useEffect} from 'react';
import Layout from '../components/layout';
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
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { use } from 'react';


const MotionPaper = motion.create(Paper);
const MotionFab = motion.create(Fab);

const initialAnnouncements = [
  {
    id: 1,
    title: 'Perubahan jadwal masuk magang',
    admin: 'Admin Magang',
    date: '30 Oktober 2099',
  },
];

export default function Announcements() {
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Fetch announcements from the API
  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/announcement/allAnnouncement?title=${searchQuery}`);
      setAnnouncements(response.data.data);
      console.log('Announcements fetched:', response.data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };


  useEffect(() => {
    fetchAnnouncements();
  }, [searchQuery]);

  useEffect(() => {
    console.log('Announcements updated:', announcements);
  })
  const handleViewClick = (id) => {
    navigate(`/homeMagang/announcements/${id}`);
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
                </MotionPaper>
              ))}
            </Box>
          </AnimatePresence>
        </Box>
      </motion.div>
    {/* <Box sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Announcements
      </Typography>
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search announcements"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <Card>
        <CardContent>
          <List>
            {announcements.map((announcement, index) => (
              <React.Fragment key={announcement.id}>
                {index > 0 && <Divider />}
                <ListItem alignItems="flex-start" sx={{ flexDirection: 'column' }}>
                  <ListItemText
                    primary={
                      <Typography variant="h6" color="primary">
                        {announcement.title}
                      </Typography>
                    }
                    secondary={
                      <React.Fragment>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {announcement.author} - {announcement.date}
                        </Typography>
                        <Typography
                          component="p"
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 1 }}
                        >
                          {announcement.content}
                        </Typography>
                      </React.Fragment>
                    }
                  />
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box> */}
    </Layout>
  );
}

