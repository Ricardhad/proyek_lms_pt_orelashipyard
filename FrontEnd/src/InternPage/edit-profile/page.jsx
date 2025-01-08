import Layout from '../components/layout';
import React, { useEffect, useState } from 'react';
import {
  Typography,
  TextField,
  Button,
  Box,
  Card,
  CardContent,
  Avatar,
  Grid,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Input = styled('input')({
  display: 'none',
});

export default function EditProfile() {
  const [profileData, setProfileData] = useState({
    name: 'Esthera Jackson',
    email: 'esthera@simmple.com',
    noWa: '08123456789',
    nrp: '123456789',
    school: 'SMAN 6',
  });
  const [avatar, setAvatar] = useState('/placeholder.svg');
  const token = localStorage.getItem("token");
  const user = useSelector((state) => state.auth.user);
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/anakMagang/${user.id}/Profile`);
        setUserData(response.data);
        console.log("edit profile",response.data);
        // console.log("edit profile",userData.data);
        // Set the profile data from fetched user data
        setProfileData({
          avatar: response.data.user.Profile_Picture,
          name: response.data.user.namaUser,
          email: response.data.user.email,
          noWa: response.data.user.noTelpon,
          // nrp: response.data.nrp,
          school: response.data.anakMagang.AsalSekolah, // Assuming this maps to school
        });
        // console.log("Profile Data:", profileData);
      } catch (err) {
        setError(err.response?.data?.error || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user.id]);
  // useEffect(() => {
  //   console.log("userData updated:", userData.anakMagang);
  // }, [userData]);
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setAvatar(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.put(`http://localhost:3000/api/anakMagang/${userData.anakMagang._id}/ProfileEdit`, {
        namaUser: profileData.name,
        email: profileData.email,
        noTelpon: profileData.noWa,
        asalSekolah: profileData.school
      });
      // {
      //   headers: {
      //     Authorization: `Bearer ${token}` // Include token in headers if needed
      //   }
      // });

      console.log('Profile updated successfully:', response.data);
      navigate(-1)

      // Optionally, you can update local state or show a success message
    } catch (error) {
      console.error('Error updating profile:', error);
      // Handle error appropriately
    }
  };

  return (
    <Layout>
      <Box sx={{ py: 4 ,maxWidth: '800px', margin: '0 auto'}}>
        <Typography variant="h4" gutterBottom>
          Edit Profile
        </Typography>
        <Card>
          <CardContent>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} display="flex" justifyContent="center">
                  <Box position="relative">
                    <Avatar
                      src={profileData.avatar}  
                      sx={{ width: 100, height: 100, mb: 2 }}
                    />
                    <label htmlFor="avatar-input">
                      <Input
                        accept="image/*"
                        id="avatar-input"
                        type="file"
                        onChange={handleAvatarChange}
                      />
                      <Button
                        variant="contained"
                        component="span"
                        size="small"
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          right: 0,
                          borderRadius: '50%',
                          minWidth: 'unset',
                          width: 32,
                          height: 32,
                        }}
                      >
                        +
                      </Button>
                    </label>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={profileData.name}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="WhatsApp Number"
                    name="noWa"
                    value={profileData.noWa}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="School"
                    name="school"
                    value={profileData.school}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                {/* <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="School"
                    name="school"
                    value={profileData.school}
                    onChange={handleInputChange}
                    required
                  />
                </Grid> */}
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Save Changes
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Layout>
  );
}