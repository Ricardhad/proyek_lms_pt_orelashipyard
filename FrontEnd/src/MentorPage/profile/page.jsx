'use client'

import { Box, Typography, Paper, Avatar, Grid2 as Grid } from '@mui/material'
import Layout from '../components/layout'

export default function ProfilePage() {
  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>Mentors</Typography>
        <Paper sx={{ p: 4, backgroundColor: '#f5f5f5', borderRadius: '16px' }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Typography variant="h3" sx={{ mb: 2, fontWeight: 'bold' }}>
                  HI, I'm
                </Typography>
                <Typography variant="h3" sx={{ mb: 2, fontWeight: 'bold' }}>
                  Learning and Developer
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Avatar
                  src="/placeholder.svg"
                  alt="Mentor Profile"
                  sx={{
                    width: 300,
                    height: 300,
                    borderRadius: '50%',
                    border: '4px solid white',
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Layout>
  )
}

