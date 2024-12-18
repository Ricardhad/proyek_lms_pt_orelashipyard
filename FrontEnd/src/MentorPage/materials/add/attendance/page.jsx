'use client'

import { useState } from 'react'
import { 
  Box, 
  Typography, 
  TextField, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Avatar,
  Checkbox,
  Button
} from '@mui/material'
import { Image, Add } from '@mui/icons-material'
import Layout from '@/components/layout'

// Mock data for interns
const interns = [
  {
    id: '123456789',
    name: 'Esthera Jackson',
    email: 'esthera@simmmple.com',
    phone: '08123456789',
    course: 'Learning and Development',
    avatar: '/placeholder.svg',
    isPresent: false
  },
  {
    id: '123456789',
    name: 'Esthera Jackson',
    email: 'esthera@simmmple.com',
    phone: '08123456789',
    course: 'Learning and Development',
    avatar: '/placeholder.svg',
    isPresent: false
  },
  {
    id: '123456789',
    name: 'Esthera Jackson',
    email: 'esthera@simmmple.com',
    phone: '08123456789',
    course: 'Learning and Development',
    avatar: '/placeholder.svg',
    isPresent: false
  },
  {
    id: '123456789',
    name: 'Esthera Jackson',
    email: 'esthera@simmmple.com',
    phone: '08123456789',
    course: 'Learning and Development',
    avatar: '/placeholder.svg',
    isPresent: false
  },
  {
    id: '123456789',
    name: 'Esthera Jackson',
    email: 'esthera@simmmple.com',
    phone: '08123456789',
    course: 'Learning and Development',
    avatar: '/placeholder.svg',
    isPresent: false
  },
  {
    id: '123456789',
    name: 'Esthera Jackson',
    email: 'esthera@simmmple.com',
    phone: '08123456789',
    course: 'Learning and Development',
    avatar: '/placeholder.svg',
    isPresent: false
  }
]

export default function AttendancePage() {
  const [attendance, setAttendance] = useState(interns)

  const handleToggleAttendance = (id) => {
    setAttendance(attendance.map(intern => 
      intern.id === id ? { ...intern, isPresent: !intern.isPresent } : intern
    ))
  }

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">ABSENSI</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              sx={{ backgroundColor: '#e0e0e0', color: 'black' }}
            >
              Back
            </Button>
            <Button variant="contained" color="primary">
              Submit
            </Button>
          </Box>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Paper
            sx={{
              p: 3,
              mb: 3,
              width: 200,
              height: 150,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f0f0f0',
            }}
          >
            <Image sx={{ fontSize: 40, mb: 1 }} />
            <Add fontSize="small" />
          </Paper>

          <TextField
            fullWidth
            label="JUDUL"
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="DESKRIPSI"
            variant="outlined"
            multiline
            rows={4}
            sx={{ mb: 2 }}
          />
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
              </TableRow>
            </TableHead>
            <TableBody>
              {attendance.map((intern, index) => (
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
                    <Checkbox
                      checked={intern.isPresent}
                      onChange={() => handleToggleAttendance(intern.id)}
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

