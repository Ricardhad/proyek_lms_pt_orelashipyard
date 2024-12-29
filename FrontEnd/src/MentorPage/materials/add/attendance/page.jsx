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
import { useNavigate } from 'react-router-dom'
import { Image, Add } from '@mui/icons-material'
import Layout from '../../../components/layout'

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
    id: '987654321',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '08987654321',
    course: 'Web Development',
    avatar: '/placeholder.svg',
    isPresent: false
  },
  {
    id: '456789123',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '08456789123',
    course: 'Data Science',
    avatar: '/placeholder.svg',
    isPresent: false
  },
  {
    id: '789123456',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    phone: '08789123456',
    course: 'Mobile App Development',
    avatar: '/placeholder.svg',
    isPresent: false
  },
  {
    id: '321654987',
    name: 'Bob Williams',
    email: 'bob@example.com',
    phone: '08321654987',
    course: 'UI/UX Design',
    avatar: '/placeholder.svg',
    isPresent: false
  },
  {
    id: '654987321',
    name: 'Emma Brown',
    email: 'emma@example.com',
    phone: '08654987321',
    course: 'Artificial Intelligence',
    avatar: '/placeholder.svg',
    isPresent: false
  }
]

export default function AttendancePage() {
  const [attendance, setAttendance] = useState(interns)
  const navigate = useNavigate()

  const handleToggleAttendance = (id) => {
    setAttendance(attendance.map(intern => 
      intern.id === id ? { ...intern, isPresent: !intern.isPresent } : intern
    ))
  }

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              sx={{ backgroundColor: '#e0e0e0', color: 'black' }}
              onClick={() => navigate(-1)}
            >
              Back
            </Button>
            <Button variant="contained" color="primary">
              Submit
            </Button>
          </Box>
        </Box>
        <Typography variant="h4" sx={{ textAlign: 'center'}}>ABSENSI</Typography>
        <Box sx={{ mb: 4 ,display:'flex',justifyContent: 'space-between'}}>
          <Paper
            sx={{
              p: 3,
              mb: 3,
              width: 400, // Increased width
              height: 225, // Adjusted height for 16:9 aspect ratio
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
          <Box>
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

