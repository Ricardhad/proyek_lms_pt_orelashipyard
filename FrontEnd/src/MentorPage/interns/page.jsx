'use client'

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Avatar, Typography } from '@mui/material'
import Layout from '@/components/layout'
import Link from 'next/link'

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
            {interns.map((intern) => (
              <TableRow key={intern.id}>
                <TableCell>{intern.id}</TableCell>
                <TableCell>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Avatar src={intern.avatar} />
                    <div>
                      <Typography variant="subtitle2">{intern.name}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {intern.email}
                      </Typography>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{intern.phone}</TableCell>
                <TableCell>{intern.course}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{ backgroundColor: '#e0e0e0', color: 'black' }}
                    component={Link}
                    href={`/interns/${intern.id}`}
                  >
                    Detail
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Layout>
  )
}

