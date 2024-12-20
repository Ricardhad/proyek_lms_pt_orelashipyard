'use client'

import { Box, Button, TextField, Typography, Paper, Grid } from '@mui/material'
import Layout from '@/MentorPage/components/layout'
import { Image, Description, Add, Person } from '@mui/icons-material'
import { useRouter } from 'next/navigation'

export default function AddMaterialPage() {
  const router = useRouter()

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>ADD MATERIAL</Typography>
        <Paper sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box
                sx={{
                  border: '2px dashed #ccc',
                  borderRadius: 1,
                  p: 3,
                  textAlign: 'center',
                  mb: 3,
                }}
              >
                <Image sx={{ fontSize: 48, color: '#666' }} />
                <Typography>Drop your image here or browse</Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="JUDUL"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="DESKRIPSI"
                variant="outlined"
                multiline
                rows={4}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="DEADLINE"
                variant="outlined"
                type="datetime-local"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Paper
                    sx={{
                      p: 3,
                      textAlign: 'center',
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: '#f5f5f5' },
                    }}
                    onClick={() => router.push('/materials/add/form')}
                  >
                    <Description sx={{ fontSize: 32, mb: 1 }} />
                    <Typography>Tugas Form</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper
                    sx={{
                      p: 3,
                      textAlign: 'center',
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: '#f5f5f5' },
                    }}
                    onClick={() => router.push('/materials/add/zip')}
                  >
                    <Add sx={{ fontSize: 32, mb: 1 }} />
                    <Typography>Pengumpulan Folder .ZIP</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper
                    sx={{
                      p: 3,
                      textAlign: 'center',
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: '#f5f5f5' },
                    }}
                    onClick={() => router.push('/materials/add/attendance')}
                  >
                    <Person sx={{ fontSize: 32, mb: 1 }} />
                    <Typography>Absensi</Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button variant="contained" color="inherit">
                Back
              </Button>
              <Button variant="contained" color="primary">
                Submit
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Layout>
  )
}

