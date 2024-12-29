import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Box, Typography, Paper, Avatar, Grid2 as Grid, Stack, Chip } from '@mui/material';
import Layout from '../../components/layout'
import { motion, AnimatePresence } from 'framer-motion'

// Mock data for the intern
const internData = {
  name: 'Esthera Jackson',
  email: 'esthera@simmmple.com',
  school: 'SMAN 6',
  phone: '08123456789',
  nrp: '123456789',
  course: 'Learning and Development',
  avatar: '/placeholder.svg'
}

const materials = [
  { id: 1, name: 'Materi 1', score: 90, type: 'Tugas' },
  { id: 2, name: 'Materi 3', score: 90, type: 'Project' },
]

const MotionPaper = motion.create(Paper)
const MotionGrid = motion.create(Grid)

export default function InternDetailPage() {
  const { id } = useParams()
  const [attendance] = useState(Array(14).fill(true))

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mx: 'auto', textAlign: 'center' }}>Interns Detail</Typography>
        <Paper sx={{ p: 4, backgroundColor: '#f5f5f5', borderRadius: '16px', justifyContent: 'center'  }}>
          <Grid container spacing={4} sx={{ justifyContent: 'center'}}>
            <Grid item xs={12} md={4} sx={{ justifyContent: 'center', mx: 'auto' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Avatar
                  src={internData.avatar}
                  alt={internData.name}
                  sx={{
                    width: 200,
                    height: 200,
                    border: '4px solid white'
                  }}
                />
              </Box>
              <Box sx={{backgroundColor: '#ffffff', borderRadius: '16px', mt:10}}>
                <Box sx={{ mb: 2, justifyContent: 'center' }}>
                  <Typography variant="body1" sx={{ textAlign: 'center' }}>{internData.name}</Typography>
                  <Typography variant="body2" sx={{ textAlign: 'center' }} color="textSecondary">{internData.email}</Typography>
                </Box>
                <Box sx={{ mb: 2, justifyContent: 'center' }}>
                  <Typography variant="body1" sx={{ textAlign: 'center' }}>{internData.school}</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                  <Typography variant="body2">No Wa: {internData.phone}</Typography>
                  <Typography variant="body2">NRP: {internData.nrp}</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                {internData.course}
              </Typography>
              <Paper sx={{ p: 2, backgroundColor: 'white', borderRadius: '8px', display:'flex'}}>
                <Typography variant="h6" sx={{ mb: 2, mr:3}}>Absensi</Typography>
                <Stack direction="row" spacing={1}>
                  {Array(15)
                    .fill('✓')
                    .map((check, index) => (
                      <Typography
                        key={index}
                        sx={{
                          color: index < 14 ? 'success.main' : 'text.disabled',
                          fontSize: '24px',
                        }}
                      >
                        {check}
                      </Typography>
                    ))}
                </Stack>
              </Paper>
              <Box sx={{ mt: 4 }}>
                <Grid container spacing={2}>
                  {materials.map((material, index) => (
                    <MotionGrid 
                      item 
                      xs={12} 
                      sm={6} 
                      md={4} 
                      key={material.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <MotionPaper 
                        sx={{ p: 2, backgroundColor: 'white', borderRadius: '8px' }}
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
                            <Avatar
                              src={internData.avatar}
                              alt={internData.name}
                              sx={{
                                width: 48,
                                height: 48,
                                border: '4px solid white',
                              }}
                            />
                          </motion.div>
                          <Typography variant="subtitle1">{material.name}</Typography>
                          <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
                            <Chip label={`${material.score}/100`} color="primary" size="small" />
                          </motion.div>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle1">{material.name}</Typography>
                          <Typography variant="body2" color="textSecondary">{material.type}</Typography>
                        </Box>
                      </MotionPaper>
                    </MotionGrid>
                  ))}
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Layout>
  )
}

