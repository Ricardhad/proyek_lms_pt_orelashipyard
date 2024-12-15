'use client'

import { useState } from 'react'
import { 
  Box, 
  Typography, 
  Paper, 
  IconButton, 
  Fab, 
  Button,
  InputBase,
} from '@mui/material'
import { 
  Add as AddIcon, 
  Search as SearchIcon,
  ChevronRight,
} from '@mui/icons-material'
import Layout from '@/components/layout'

// Mock announcement data
const initialAnnouncements = [
  {
    id: 1,
    title: 'Perubahan jadwal masuk magang',
    admin: 'Admin Magang',
    date: '30 Oktober 2099',
  }
]

export default function AnnouncementPage() {
  const [announcements, setAnnouncements] = useState(initialAnnouncements)
  const [searchQuery, setSearchQuery] = useState('')

  const handleDelete = (id) => {
    setAnnouncements(announcements.filter(announcement => announcement.id !== id))
  }

  return (
    <Layout>
      <Box sx={{ p: 3, position: 'relative', minHeight: '100vh' }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 4
        }}>
          <Typography variant="h4">Anouncement</Typography>
          <Paper
            sx={{
              p: '2px 4px',
              display: 'flex',
              alignItems: 'center',
              width: 400,
              borderRadius: '20px',
              backgroundColor: '#fff'
            }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <IconButton sx={{ p: '10px' }}>
              <SearchIcon />
            </IconButton>
          </Paper>
        </Box>

        {/* Announcements List */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {announcements.map((announcement) => (
            <Paper
              key={announcement.id}
              sx={{
                p: 2,
                backgroundColor: '#ff7f7f',
                color: 'white',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Box>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {announcement.title}
                </Typography>
                <Typography variant="body2">
                  {announcement.admin}, {announcement.date}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button
                  variant="contained"
                  size="small"
                  sx={{ 
                    backgroundColor: '#4B0082',
                    '&:hover': {
                      backgroundColor: '#3B0062'
                    }
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  sx={{ 
                    backgroundColor: '#FF0000',
                    '&:hover': {
                      backgroundColor: '#CC0000'
                    }
                  }}
                  onClick={() => handleDelete(announcement.id)}
                >
                  Delete
                </Button>
                <IconButton sx={{ color: 'white' }}>
                  <ChevronRight />
                </IconButton>
              </Box>
            </Paper>
          ))}
        </Box>

        {/* Floating Add Button */}
        <Box
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            backgroundColor: '#e0e0e0',
            borderRadius: '12px',
            p: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Fab
            color="default"
            aria-label="add"
            sx={{ 
              mb: 1,
              backgroundColor: '#e0e0e0',
              '&:hover': {
                backgroundColor: '#d0d0d0'
              }
            }}
          >
            <AddIcon />
          </Fab>
          <Typography variant="caption">Add Anouncement</Typography>
        </Box>
      </Box>
    </Layout>
  )
}

