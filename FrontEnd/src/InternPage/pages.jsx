import React from 'react';
import MainLayout from './main-layout';
import { Typography, Box } from '@mui/material';

export default function Home() {
  return (
    <MainLayout>
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome to Intern Management System
        </Typography>
        <Typography variant="body1">
          Please use the sidebar to navigate through different sections.
        </Typography>
      </Box>
    </MainLayout>
  );
}

