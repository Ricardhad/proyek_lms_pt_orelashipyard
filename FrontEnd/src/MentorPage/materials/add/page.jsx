import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Image, Description, Add, Person } from '@mui/icons-material';
import Layout from '../../components/layout';
import { useDispatch, useSelector } from 'react-redux';
import { setMaterial, setGambar, clearMaterial, selectMaterial } from '../../../redux/materialSlice';
import axios from 'axios';


export default function AddMaterialPage() {
  const user = useSelector((state) => state.auth.user);
  console.log("add materials",user.id);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const material = useSelector(selectMaterial);
  const [imageFile, setImageFile] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/mentor/${user.id}/Profile`); // Adjust the base URL if necessary
        console.log("goblok",response.data);
        setUserData(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user.id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(setMaterial({ [name]: value }));
  };

  const handleImageDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files[0] || e.target.files[0];
    
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        dispatch(setGambar({ 
          path: file.name,  // Temporary path, will be replaced with server path
          preview: reader.result 
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formData = new FormData();
      formData.append('courseID', material.courseID);
      formData.append('mentorID', material.mentorID);
      formData.append('namaModul', material.namaModul);
      formData.append('Deskripsi', material.Deskripsi);
      formData.append('Deadline', material.Deadline);
      if (imageFile) {
        formData.append('gambar', imageFile);
      }

      // Make your API call here
      // const response = await axios.post('/api/materials', formData);
      console.log('Submitting:', formData);
      
      // Clear form after successful submission
      dispatch(clearMaterial());
      setImageFile(null);
      
    } catch (error) {
      console.error('Error submitting material:', error);
    }
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
                <Box
                  component="label"
                  htmlFor="image-upload"
                  sx={{
                    border: '2px dashed #ccc',
                    borderRadius: 1,
                    p: 3,
                    textAlign: 'center',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    position: 'relative',
                    '&:hover': {
                      borderColor: '#666',
                    },
                  }}
                  onDrop={handleImageDrop}
                  onDragOver={handleDragOver}
                >
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleImageDrop}
                  />
                  {material.imagePreview ? (
                    <Box
                      sx={{
                        width: '100%',
                        height: '200px',
                        backgroundImage: `url(${material.imagePreview})`,
                        backgroundSize: 'contain',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                      }}
                    />
                  ) : (
                    <>
                      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
                        <Image sx={{ fontSize: 48, color: '#666' }} />
                      </Box>
                      <Typography>Drop your image here or browse</Typography>
                    </>
                  )}
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                  <TextField
                    fullWidth
                    label="NAMA MODUL"
                    variant="outlined"
                    name="namaModul"
                    value={material.namaModul || ''}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="DESKRIPSI"
                    variant="outlined"
                    name="Deskripsi"
                    value={material.Deskripsi || ''}
                    onChange={handleChange}
                    multiline
                    rows={4}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="DEADLINE"
                    variant="outlined"
                    name="Deadline"
                    value={material.Deadline || ''}
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