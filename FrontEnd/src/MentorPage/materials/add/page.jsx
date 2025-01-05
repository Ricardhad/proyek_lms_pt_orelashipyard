import React from 'react';
import { Box, Button, TextField, Typography, Paper, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Image, Description, Add, Person } from '@mui/icons-material';
import Layout from '../../components/layout';
import { useDispatch, useSelector } from 'react-redux';
import { setMaterial, clearMaterial } from '../../../redux/materialSlice';

export default function AddMaterialPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const material = useSelector((state) => state.material);

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(setMaterial({ ...material, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission (e.g., API call)
    console.log(material);
    // Optionally clear the form
    // dispatch(clearMaterial());
  };

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button variant="contained" color="inherit" onClick={() => navigate(-1)}>
            Back
          </Button>
        </Grid>
        <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>ADD MATERIAL</Typography>
        <Paper sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{
                  border: '2px dashed #ccc',
                  borderRadius: 1,
                  p: 3,
                  textAlign: 'center',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
                    <Image sx={{ fontSize: 48, color: '#666' }} />
                  </Box>
                  <Typography>Drop your image here or browse</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                  <TextField
                    fullWidth
                    label="JUDUL"
                    variant="outlined"
                    name="title"
                    value={material.title}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="DESKRIPSI"
                    variant="outlined"
                    name="description"
                    value={material.description}
                    onChange={handleChange}
                    multiline
                    rows={4}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="DEADLINE"
                    variant="outlined"
                    name="deadline"
                    value={material.deadline}
                    onChange={handleChange}
                    type="datetime-local"
                    InputLabelProps={{ shrink: true }}
                  />
                </Box>
              </Grid>
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
                    onClick={() => navigate('/homeMentor/materials/add/form')}
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
                    onClick={() => navigate('/homeMentor/materials/add/zip')}
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
                    onClick={() => navigate('/homeMentor/materials/add/attendance')}
                  >
                    <Person sx={{ fontSize: 32, mb: 1 }} />
                    <Typography>Absensi</Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sx={{ textAlign: 'center', mt: 3 }}>
              <Button variant="contained" type="submit">Submit</Button>
            </Grid>
          </form>
        </Paper>
      </Box>
    </Layout>
  );
}