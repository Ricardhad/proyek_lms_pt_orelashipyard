import { Grid2 as Grid, Card, CardMedia, CardContent, Typography, Button, Box, Avatar } from '@mui/material'
import { AppBar, Toolbar, InputBase } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { Add as AddIcon } from '@mui/icons-material'
import { motion } from 'framer-motion';
import Layout from '../components/layout'
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import { useSelector } from 'react-redux';
import axios from 'axios';

const MotionGrid = motion(Grid);
const MotionCard = motion(Card);

const materials = [
  {
    id: 1,
    title: 'Materi 1',
    mentorName: 'Mentor Name',
    mentorAvatar: '/placeholder.svg',
    deadline: '12:30 pm',
    type: 'Tugas',
    thumbnail: '/placeholder.svg'
  },
  {
    id: 3,
    title: 'Materi 3',
    mentorName: 'Mentor Name',
    mentorAvatar: '/placeholder.svg',
    deadline: '12:30 pm',
    type: 'Latihan',
    thumbnail: '/placeholder.svg'
  },
]

export default function MaterialsPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('');

  const handleMaterialClick = (material) => {
    if (material.type === 'Tugas') {
      navigate(`/homeMentor/materials/check-tugas/${material.id}`)
    } else if (material.type === 'Latihan') {
      navigate(`/homeMentor/materials/check-latihan/${material.id}`)
    }
  }

  return (
    <Layout>
      <AppBar position="static" color="transparent" elevation={3}>
        <Toolbar>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search Name..."
              inputProps={{ 'aria-label': 'search' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Search>
        </Toolbar>
      </AppBar>
      <Typography variant="h4" sx={{ p: 3 }}>MATERIAL</Typography>
      <Grid container spacing={3} sx={{ p: 3 }}>
        {materials.map((material, index) => (
          <MotionGrid 
            item 
            key={material.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <MotionCard 
              sx={{ display: 'flex', height: '100%', cursor: 'pointer' }}
              onClick={() => handleMaterialClick(material)}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.2 }}
            >
              <CardMedia
                component="img"
                sx={{ width: 151 }}
                image={material.thumbnail}
                alt={material.title}
              />
              <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <CardContent sx={{ flex: '1 0 auto' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
                      <Avatar src={material.mentorAvatar} sx={{ mr: 1 }} />
                    </motion.div>
                    <Typography variant="subtitle2">{material.mentorName}</Typography>
                  </Box>
                  <Typography variant="h6">{material.title}</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Typography variant="body2" color="error">
                      Deadline {material.deadline}
                    </Typography>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        size="small"
                        sx={{ backgroundColor: '#e0e0e0', color: 'black' }}
                      >
                        {material.type}
                      </Button>
                    </motion.div>
                  </Box>
                </CardContent>
              </Box>
            </MotionCard>
          </MotionGrid>
        ))}
        <Grid item xs={12} sm={6} md={4}>
          <Link to="/homeMentor/materials/add" style={{ textDecoration: 'none' }}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#e0e0e0',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: '#d0d0d0',
                },
              }}
            >
              <CardContent>
                <Box sx={{ textAlign: 'center' }}>
                  <AddIcon sx={{ fontSize: 48, mb: 1 }} />
                  <Typography>TAMBAH MATERI</Typography>
                </Box>
              </CardContent>
            </Card>
          </Link>
        </Grid>
      </Grid>
    </Layout>
  )
}

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    width: '100%',
  },
}));

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: '#fff',
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));