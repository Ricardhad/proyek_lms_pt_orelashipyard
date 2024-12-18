'use client'

import { Box, Typography, Paper, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar } from '@mui/material'
import Layout from '@/components/layout'
import { Image } from '@mui/icons-material'

const interns = [
  {
    id: '123456789',
    name: 'Esthera Jackson',
    email: 'esthera@simmmple.com',
    phone: '08123456789',
    course: 'Learning and Development',
    avatar: '/placeholder.svg'
  },
  // Repeat intern data 6 more times for the example
]

export default function CheckTugasPage() {
  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4 
        }}>
          <Typography variant="h4" sx={{ mb: 4 }}>MATERIAL 1</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" sx={{ backgroundColor: '#e0e0e0', color: 'black' }}>
              Back
            </Button>
            <Button variant="contained" color="primary">
              Submit
            </Button>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 4, mb: 4 }}>
          <Paper
            sx={{
              width: 400,
              height: 250,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f0f0f0',
            }}
          >
            <Image sx={{ fontSize: 40 }} />
          </Paper>
          
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>Materi 1</Typography>
            <Typography sx={{ mb: 2 }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography>DEADLINE : </Typography>
              <Typography color="error">12:30 pm</Typography>
            </Box>
          </Box>
        </Box>

        <TableContainer component={Paper} sx={{ backgroundColor: '#f5f5f5' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#e0e0e0' }}>
                <TableCell>ID</TableCell>
                <TableCell>Name & Email</TableCell>
                <TableCell>Phone Number</TableCell>
                <TableCell>Course</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Score</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {interns.map((intern, index) => (
                <TableRow key={index}>
                  <TableCell>{intern.id}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar src={intern.avatar} />
                      <Box>
                        <Typography variant="subtitle2">{intern.name}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          {intern.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{intern.phone}</TableCell>
                  <TableCell>{intern.course}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      size="small"
                      sx={{ backgroundColor: '#e0e0e0', color: 'black' }}
                    >
                      Download
                    </Button>
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      variant="outlined"
                      size="small"
                      InputProps={{ inputProps: { min: 0, max: 100 } }}
                      sx={{ width: '80px' }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Layout>
  )
}

