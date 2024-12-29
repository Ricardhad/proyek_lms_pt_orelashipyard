import { Box, Button, TextField, Typography, Paper } from '@mui/material'
import { motion } from 'framer-motion'
import Layout from '../../components/layout'
import { useNavigate } from 'react-router-dom'

const MotionPaper = motion.create(Paper)

export default function CreateAnnouncementPage() {
  const navigate = useNavigate()

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

