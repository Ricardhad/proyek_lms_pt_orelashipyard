import { useState, useEffect } from 'react'
import { Box, Button, TextField, Typography, Paper } from '@mui/material'
import { motion } from 'framer-motion'
import Layout from '../../../components/layout'
import { useNavigate, useParams } from 'react-router-dom'

const MotionPaper = motion.create(Paper)

// Mock function to fetch announcement data
const fetchAnnouncementData = async (id) => {
  // In a real application, this would be an API call
  return {
    id: id,
    title: 'Perubahan jadwal masuk magang',
    description: 'Jadwal masuk magang akan diubah mulai minggu depan.',
    admin: 'Admin Magang',
    date: '2099-10-30',
  }
}

export default function EditAnnouncementPage() {
  const navigate = useNavigate()
  const params = useParams()
  const [announcement, setAnnouncement] = useState(null)

  useEffect(() => {
    const loadAnnouncement = async () => {
      const data = await fetchAnnouncementData(params.id)
      setAnnouncement(data)
    }
    loadAnnouncement()
  }, [params.id])

  const handleChange = (e) => {
    setAnnouncement({
      ...announcement,
      [e.target.name]: e.target.value
    })
  }

  if (!announcement) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Typography>Loading...</Typography>
      </motion.div>
    )
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
  )
}

