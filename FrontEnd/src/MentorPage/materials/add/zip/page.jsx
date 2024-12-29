import { Box, Button, TextField, Typography, Paper, Grid } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Image, Add } from '@mui/icons-material'
import Layout from '../../../components/layout'

export default function ZipSubmissionPage() {
  const navigate = useNavigate()

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 4 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
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
            <Button 
              variant="contained" 
              sx={{ 
                borderRadius: '20px',
                textTransform: 'none'
              }}
            >
              Submit
            </Button>
          </Box>
        </Box>

        <Box sx={{mx: 'auto' }}>
          <Box sx={{ mb: 4 }}>
          <Typography variant="h4"  sx={{ mb: 3, textAlign: 'center' }}>PENGUMPULAN ZIP</Typography>
      <Grid container spacing={3}>
  <Grid item xs={12} md={6}>
    <Paper
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 1,
        textAlign: 'center',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
  <Image sx={{ fontSize: 48, color: '#666' }} />
</Box>
      <Typography>Drop your image here or browse</Typography>
            
</Paper>
  </Grid>
  <Grid item xs={12} md={6}>
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
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
        variant="outlined"
        type="datetime-local"
        InputLabelProps={{ shrink: true }}
      />
    </Box>
  </Grid>
</Grid>
          
        </Box>

          <Button
            fullWidth
            variant="contained"
            sx={{
              py: 2,
              backgroundColor: '#f0f0f0',
              color: 'black',
              borderRadius: '30px',
              '&:hover': {
                backgroundColor: '#e0e0e0',
              },
            }}
            startIcon={<Add />}
          >
            Upload Materi
          </Button>
        </Box>
      </Box>
    </Layout>
  )
}

