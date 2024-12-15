import MainLayout from '../main-layout';
import React, { useState } from 'react';
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Updated profile data:', profileData);
  };

  return (
    <MainLayout>
    <Box sx={{ py: 4 }}>
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
                    src={avatar}
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
                  label="NRP"
                  name="nrp"
                  value={profileData.nrp}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="School"
                  name="school"
                  value={profileData.school}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
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
    </MainLayout>
  );
}

MainLayout

