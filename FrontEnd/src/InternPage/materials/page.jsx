'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '../main-layout';
import {
  Box,
  Card,
  Typography,
  Avatar,
  Stack,
  Chip,
  Grid,
} from '@mui/material';
import Image from 'next/image';

export default function Materials() {
  const router = useRouter();
  
  const handleMaterialClick = (material) => {
    if (material.type === 'Latihan') {
      router.push(`/${material.id}/form`);
    } else if (material.type === 'Tugas') {
      router.push(`/${material.id}/zip`);
    }
  };

  const profileData = {
    name: 'Esthera Jackson',
    email: 'esthera@simmple.com',
    school: 'SMAN 5',
    noWa: '08123456789',
    nrp: '123456789',
  };

  const materials = [
    {
      id: 1,
      title: 'Materi 1',
      mentor: 'Mentor Name',
      score: '90/100',
      deadline: '12:30 pm',
      type: 'Tugas',
    },
    {
      id: 2,
      title: 'Materi 2',
      mentor: 'Mentor Name',
      type: 'Materi',
    },
    {
      id: 3,
      title: 'Materi 3',
      mentor: 'Mentor Name',
      score: '90/100',
      deadline: '12:30 pm',
      type: 'Latihan',
    },
  ];

  return (
    <MainLayout>
      <Box sx={{ p: 4 }}>
        {/* Header Section */}
        <Card sx={{ mb: 4, bgcolor: '#f0f0f0', position: 'relative', p: 4 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <Typography variant="h3" gutterBottom>
                HI, I&apos;m
              </Typography>
              <Typography variant="h2" gutterBottom>
                Learning and Developer
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Absensi
                </Typography>
                <Stack direction="row" spacing={1}>
                  {Array(15)
                    .fill('✓')
                    .map((check, index) => (
                      <Typography
                        key={index}
                        sx={{
                          color: index < 14 ? 'success.main' : 'text.disabled',
                          fontSize: '24px',
                        }}
                      >
                        {check}
                      </Typography>
                    ))}
                </Stack>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Avatar
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/User%20Intern%20Page-0oscu56Bk080b1fN7QeSgGNpjLSSmq.png"
                  sx={{
                    width: 120,
                    height: 120,
                    mx: 'auto',
                    mb: 2,
                  }}
                />
                <Typography variant="h6">{profileData.name}</Typography>
                <Typography color="text.secondary">{profileData.email}</Typography>
                <Typography>{profileData.school}</Typography>
                <Stack
                  direction="row"
                  spacing={2}
                  justifyContent="center"
                  sx={{ mt: 1 }}
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
              </Box>
            </Grid>
          </Grid>
        </Card>

        {/* Materials Section */}
        <Grid container spacing={2}>
          {materials.map((material) => (
            <Grid item xs={12} md={6} key={material.id}>
              <Card
                sx={{
                  p: 2,
                  display: 'flex',
                  gap: 2,
                  borderRadius: 2,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  height: '100%',
                  cursor: 'pointer',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  },
                }}
                onClick={() => handleMaterialClick(material)}
              >
                <Box
                  sx={{
                    width: 200,
                    height: 150,
                    bgcolor: 'grey.200',
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography color="text.secondary">Image</Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar
                        src="/placeholder.svg"
                        sx={{ width: 24, height: 24, mr: 1 }}
                      />
                      <Typography variant="subtitle2">{material.mentor}</Typography>
                    </Box>
                    {material.score && (
                      <Typography
                        variant="h6"
                        sx={{ ml: 'auto', fontWeight: 'bold' }}
                      >
                        {material.score}
                      </Typography>
                    )}
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {material.title}
                  </Typography>
                  {material.deadline && (
                    <Typography color="error.main" variant="caption" gutterBottom>
                      Deadline {material.deadline}
                    </Typography>
                  )}
                  <Box sx={{ mt: 1 }}>
                    <Chip
                      label={material.type}
                      size="small"
                      color={
                        material.type === 'Tugas'
                          ? 'primary'
                          : material.type === 'Latihan'
                          ? 'secondary'
                          : 'default'
                      }
                      sx={{
                        bgcolor:
                          material.type === 'Tugas'
                            ? 'rgba(25, 118, 210, 0.1)'
                            : material.type === 'Latihan'
                            ? 'rgba(255, 107, 107, 0.1)'
                            : 'grey.100',
                      }}
                    />
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </MainLayout>
  );
}

