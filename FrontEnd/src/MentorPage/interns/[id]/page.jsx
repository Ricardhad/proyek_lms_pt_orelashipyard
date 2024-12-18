'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Box, Typography, Paper, Avatar, Grid, Chip } from '@mui/material'
import Layout from '@/components/layout'

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

export default function InternDetailPage() {
  const { id } = useParams()
  const [attendance, setAttendance] = useState(Array(14).fill(true))

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>Interns Detail</Typography>
        <Paper sx={{ p: 4, backgroundColor: '#f5f5f5', borderRadius: '16px' }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Avatar
                  src={internData.avatar}
                  alt={internData.name}
                  sx={{
                    width: 200,
                    height: 200,
                    border: '4px solid white',
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                {internData.course}
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1">{internData.name}</Typography>
                <Typography variant="body2" color="textSecondary">{internData.email}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1">{internData.school}</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Typography variant="body2">No Wa: {internData.phone}</Typography>
                <Typography variant="body2">NRP: {internData.nrp}</Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Absensi</Typography>
          <Paper sx={{ p: 2, backgroundColor: 'white', borderRadius: '8px' }}>
            <Grid container spacing={1}>
              {attendance.map((present, index) => (
                <Grid item key={index}>
                  <Chip
                    label={index + 1}
                    color={present ? "primary" : "default"}
                    onClick={() => {
                      const newAttendance = [...attendance]
                      newAttendance[index] = !newAttendance[index]
                      setAttendance(newAttendance)
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Materi</Typography>
          <Grid container spacing={2}>
            {materials.map((material) => (
              <Grid item xs={12} sm={6} md={4} key={material.id}>
                <Paper sx={{ p: 2, backgroundColor: 'white', borderRadius: '8px' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle1">{material.name}</Typography>
                    <Chip label={`${material.score}/100`} color="primary" size="small" />
                  </Box>
                  <Typography variant="body2" color="textSecondary">{material.type}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Layout>
  )
}

