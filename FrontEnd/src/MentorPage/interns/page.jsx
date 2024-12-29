import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Avatar, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Layout from '../components/layout'

const MotionTableRow = motion.create(TableRow)

const interns = [
  {
    id: '123456789',
    name: 'Esthera Jackson',
    email: 'esthera@simmmple.com',
    phone: '08123456789',
    course: 'Learning and Development',
    avatar: '/placeholder.svg'
  },
  // Add more intern data as needed
]


export default function InternsPage() {
  return (
    <Layout>
      <Typography variant="h4" sx={{ p: 3 }}>Interns</Typography>
      <TableContainer component={Paper} sx={{ mx: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell>ID</TableCell>
              <TableCell>Name & Email</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {interns.map((intern, index) => (
              <MotionTableRow 
                key={intern.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 0.9 }}
              >
                <TableCell>{intern.id}</TableCell>
                <TableCell>
                  <motion.div 
                    style={{ display: 'flex', alignItems: 'center', gap: 12 }}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
                      <Avatar src={intern.avatar} alt={intern.name} />
                    </motion.div>
                    <div>
                      <Typography variant="subtitle2">{intern.name}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {intern.email}
                      </Typography>
                    </div>
                  </motion.div>
                </TableCell>
                <TableCell>{intern.phone}</TableCell>
                <TableCell>{intern.course}</TableCell>
                <TableCell>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="contained"
                      size="small"
                      sx={{ backgroundColor: '#e0e0e0', color: 'black' }}
                      component={Link}
                      to={`/homeMentor/interns/${intern.id}`}
                    >
                      Detail
                    </Button>
                  </motion.div>
                </TableCell>
              </MotionTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Layout>
  )
}

