'use client'

import React from 'react';
import { Box } from '@mui/material';
import Sidebar from '@/components/sidebar';

export default function MainLayout({ children }) {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: '240px', // This should match the width of the Sidebar
          bgcolor: 'background.default',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

