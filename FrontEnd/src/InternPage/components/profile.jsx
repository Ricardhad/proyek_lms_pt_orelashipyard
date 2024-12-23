'use client'

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Grid,
} from '@mui/material';

export default function Profile() {
  const profileData = {
    name: 'Esthera Jackson',
    email: 'esthera@simmple.com',
    school: 'SMAN 5',
    noWa: '08123456789',
    nrp: '123456789',
  };

  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h3" sx={{ mb: 4 }}>
        HI, Nama Intern
      </Typography>
      <Card sx={{ borderRadius: 4, overflow: 'hidden' }}>
        <Box
          sx={{
            p: 4,
            background: 'linear-gradient(to right, #f0f0f0, #e0e0e0)',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            gap: 4,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" gutterBottom>
              HI, I&apos;m
            </Typography>
            <Typography variant="h3" sx={{ mb: 2 }}>
              Learning and Developer
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {Array(15)
                .fill('✓')
                .map((check, index) => (
                  <Typography
                    key={index}
                    sx={{
                      color: index < 14 ? 'success.main' : 'text.disabled',
                    }}
                  >
                    {check}
                  </Typography>
                ))}
            </Box>
          </Box>
          <Card sx={{ p: 2, maxWidth: 300 }}>
            <CardContent>
              <Avatar
                src="/placeholder.svg"
                sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
              />
              <Typography variant="h6" align="center" gutterBottom>
                {profileData.name}
              </Typography>
              <Typography
                variant="body2"
                align="center"
                color="text.secondary"
                gutterBottom
              >
                {profileData.email}
              </Typography>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    No Wa
                  </Typography>
                  <Typography variant="body2">{profileData.noWa}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    NRP
                  </Typography>
                  <Typography variant="body2">{profileData.nrp}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      </Card>
    </Box>
  );
}

