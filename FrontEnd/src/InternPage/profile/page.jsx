import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  Typography,
  Avatar,
  Stack,
} from '@mui/material';
import MainLayout from '../main-layout';
import { useSelector,useDispatch } from 'react-redux';
import axios from 'axios';// Import useDispatch
import { setUser } from "../../redux/authSlice"; // Import the setUser action
import * as jwtdecode from 'jwt-decode';// Default import
export default function Profile() {
  const token = localStorage.getItem("token");
  const user = useSelector((state) => state.auth.user);
  const profileData = {
    name: 'Esthera Jackson',
    email: 'esthera@simmple.com',
    school: 'SMAN 6',
    noWa: '08123456789',
    nrp: '123456789',
  };

  return (
    <MainLayout>
      <Box sx={{ height: '100vh', bgcolor: '#f5f5f5', position: 'relative' }}>
        <Typography
          variant="h2"
          sx={{
            position: 'absolute',
            top: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontWeight: 'bold',
            zIndex: 1,
          }}
        >
          HI, Nama Intern
        </Typography>
        
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            maxWidth: 400,
            textAlign: 'center',
          }}
        >
          <Card
            sx={{
              p: 4,
              borderRadius: 4,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              bgcolor: 'white',
            }}
          >
            <Avatar
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/User%20Intern%20Page-0oscu56Bk080b1fN7QeSgGNpjLSSmq.png"
              sx={{
                width: 180,
                height: 180,
                mx: 'auto',
                mb: 2,
                bgcolor: '#8B4513',
              }}
            />
            <Typography variant="h5" sx={{ mb: 1, fontWeight: 'bold' }}>
              {profileData.name}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              {profileData.email}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {profileData.school}
            </Typography>
            <Stack
              direction="row"
              spacing={4}
              justifyContent="center"
              sx={{ mb: 1 }}
            >
              <Box>
                <Typography variant="caption" color="text.secondary">
                  No Wa
                </Typography>
                <Typography variant="body2">{profileData.noWa}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  NRP
                </Typography>
                <Typography variant="body2">{profileData.nrp}</Typography>
              </Box>
            </Stack>
          </Card>
        </Box>
      </Box>
    </MainLayout>
  );
}

