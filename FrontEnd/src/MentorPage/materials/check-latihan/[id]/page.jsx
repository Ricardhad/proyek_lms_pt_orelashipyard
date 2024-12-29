import { useParams, useNavigate } from 'react-router-dom'
import { Box, Typography, Paper, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar } from '@mui/material'
import Layout from '../../../components/layout'
import { Image } from '@mui/icons-material'

const interns = [
  {
    id: '123456789',
    name: 'Esthera Jackson',
    email: 'esthera@simmmple.com',
    phone: '08123456789',
    course: 'Learning and Development',
    avatar: '/placeholder.svg',
    score: '80/100'
  },
  {
    id: '987654321',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '08987654321',
    course: 'Web Development',
    avatar: '/placeholder.svg',
    score: '75/100'
  },
  {
    id: '456789123',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '08456789123',
    course: 'Data Science',
    avatar: '/placeholder.svg',
    score: '90/100'
  },
  {
    id: '789123456',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    phone: '08789123456',
    course: 'Mobile App Development',
    avatar: '/placeholder.svg',
    score: '85/100'
  },
  {
    id: '321654987',
    name: 'Bob Williams',
    email: 'bob@example.com',
    phone: '08321654987',
    course: 'UI/UX Design',
    avatar: '/placeholder.svg',
    score: '70/100'
  },
  {
    id: '654987321',
    name: 'Emma Brown',
    email: 'emma@example.com',
    phone: '08654987321',
    course: 'Artificial Intelligence',
    avatar: '/placeholder.svg',
    score: '95/100'
  }
]

export default function CheckLatihanPage() {
  const navigate = useNavigate()
  const params = useParams()

  const handleCheck = (internId) => {
    navigate(`/homeMentor/materials/check-latihan/${params.id}/${internId}`)
  }

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4 
        }}>
          <Typography variant="h4">MATERIAL {params.id}</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" sx={{ backgroundColor: '#e0e0e0', color: 'black' }} onClick={() => navigate(-1)}>
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
            <Typography variant="h5" sx={{ mb: 2 }}>Materi {params.id}</Typography>
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
                      onClick={() => handleCheck(intern.id)}
                    >
                      Check
                    </Button>
                  </TableCell>
                  <TableCell>{intern.score}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Layout>
  )
}

