'use client'

import { Box, Button, TextField, Typography, Paper } from '@mui/material'
import Layout from '@/components/layout'
import { Image, Add } from '@mui/icons-material'

export default function ZipSubmissionPage() {
  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">PENGUMPULAN ZIP</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              sx={{ backgroundColor: '#e0e0e0', color: 'black' }}
            >
              Back
            </Button>
            <Button variant="contained" color="primary">
              Submit
            </Button>
          </Box>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Paper
            sx={{
              p: 3,
              mb: 3,
              width: 200,
              height: 150,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f0f0f0',
            }}
          >
            <Image sx={{ fontSize: 40, mb: 1 }} />
            <Add fontSize="small" />
          </Paper>

          <TextField
            fullWidth
            label="JUDUL"
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="DESKRIPSI"
            variant="outlined"
            multiline
            rows={4}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="DEADLINE"
            type="datetime-local"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 4 }}
          />

          <Paper
            sx={{
              p: 2,
              backgroundColor: '#f0f0f0',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              borderRadius: '24px',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: '#e0e0e0',
              },
            }}
          >
            <Add />
            <Typography>Upload Materi</Typography>
          </Paper>
        </Box>
      </Box>
    </Layout>
  )
}

