import { Box, Button, TextField, Typography, Paper, Grid } from '@mui/material'
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { Image, Add } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux';
import { setMaterial, setGambar, clearMaterial, selectMaterial } from '../../../../redux/materialSlice';
import axios from 'axios';
import Layout from '../../../components/layout'

export default function ZipSubmissionPage() {
  const navigate = useNavigate()
  const user = useSelector((state) => state.auth.user); // Get logged-in user from Redux
  const material = useSelector((state) => state.material); // Get material state from Redux
  const [zipFile, setZipFile] = useState(null);
  const handleZipDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files[0] || e.target.files[0];
  
    if (file && file.name.endsWith('.zip')) {
      setZipFile(file);
      console.log('ZIP file uploaded:', file.name);
    } else {
      alert('Please upload a valid ZIP file.');
    }
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(setMaterial({ [name]: value })); // Update Redux state
  };

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
                name="namaModul"
                value={material.namaModul || ''}
                onChange={handleChange}
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="DESKRIPSI"
                name="Deskripsi"
                value={material.Deskripsi || ''}
                onChange={handleChange}
                variant="outlined"
                multiline
                rows={4}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="DEADLINE"
                name="Deadline"
                value={material.Deadline || ''}
                onChange={handleChange}
                type="datetime-local"
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </Grid>
        </Grid> 
        </Box>
          <Box
            component="label"
            htmlFor="zip-upload"
            sx={{
              border: '2px dashed #ccc',
              borderRadius: '30px', // Match the button's border radius
              p: 3,
              textAlign: 'center',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative',
              backgroundColor: '#f0f0f0',
              '&:hover': {
                borderColor: '#666',
                backgroundColor: '#e0e0e0', // Match the button's hover background color
              },
            }}
            onDrop={handleZipDrop}
            onDragOver={handleDragOver}
          >
            <input
              id="zip-upload"
              type="file"
              accept=".zip"
              style={{ display: 'none' }}
              onChange={handleZipDrop}
            />
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
              <Add sx={{ fontSize: 48, color: '#666' }} /> {/* Use the Add icon instead of Image */}
            </Box>
            <Typography>Drop your ZIP file here to upload materi</Typography>
          </Box>
        </Box>
      </Box>
    </Layout>
  )
}

