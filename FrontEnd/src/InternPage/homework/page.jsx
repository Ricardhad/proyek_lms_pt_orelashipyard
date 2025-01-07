'use client'

import React from 'react';
import Layout from '../components/layout';
import {
  Box,
  Card,
  Typography,
  Avatar,
  Stack,
  Chip,
} from '@mui/material';

export default function Homework() {
  const homework = [
    {
      id: 1,
      title: 'Materi 1',
      mentor: 'Mentor Name',
      score: '90/100',
      deadline: '12:30 pm',
      type: 'Tugas',
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
    <Layout>
      <Box sx={{ p: 4 }}>
        <Typography variant="h2" sx={{ mb: 4, fontWeight: 'bold', textAlign: 'center' }}>
          Home Work
        </Typography>

        <Stack spacing={3}>
          {homework.map((assignment) => (
            <Card
              key={assignment.id}
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                p: 2,
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            >
              <Box
                sx={{
                  width: { xs: '100%', sm: 200 },
                  height: 150,
                  bgcolor: 'grey.200',
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Typography color="text.secondary">Image</Typography>
              </Box>

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: 1,
                    flexWrap: 'wrap',
                    gap: 1
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mr: 'auto' }}>
                    <Avatar
                      src="/placeholder.svg"
                      sx={{ width: 24, height: 24, mr: 1 }}
                    />
                    <Typography variant="subtitle2">{assignment.mentor}</Typography>
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{ 
                      fontWeight: 'bold',
                      ml: { xs: 0, sm: 'auto' }
                    }}
                  >
                    {assignment.score}
                  </Typography>
                </Box>

                <Typography variant="h6" gutterBottom>
                  {assignment.title}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 'auto' }}>
                  <Typography 
                    color="error.main" 
                    variant="caption"
                    sx={{ fontWeight: 'medium' }}
                  >
                    Deadline {assignment.deadline}
                  </Typography>
                  <Chip
                    label={assignment.type}
                    size="small"
                    color={assignment.type === 'Tugas' ? 'primary' : 'secondary'}
                    sx={{
                      bgcolor: assignment.type === 'Tugas'
                        ? 'rgba(25, 118, 210, 0.1)'
                        : 'rgba(255, 107, 107, 0.1)',
                      borderRadius: 1,
                    }}
                  />
                </Box>
              </Box>
            </Card>
          ))}
        </Stack>
      </Box>
    </Layout>
  );
}

