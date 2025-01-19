'use client'

import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Box,
  Button,
  Typography,
} from '@mui/material';
import {
  Person,
  Book,
  Assignment,
  Chat,
  Notifications,
  Edit,
} from '@mui/icons-material';
import { Link,useLocation,useNavigate} from 'react-router-dom'; // Changed to react-router-dom
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import client from '../../client'


const menuItems = [
    { text: 'Profile', icon: <Person />, path: '/homeMagang/' },
    { text: 'Edit Profile', icon: <Edit />, path: '/homeMagang/edit-profile' },
    { text: 'Materials', icon: <Book />, path: '/homeMagang/materials' },
    { text: 'Homework', icon: <Assignment />, path: '/homeMagang/homework' },
    { text: 'Group Chat', icon: <Chat />, path: '/homeMagang/group-chat' },
    { text: 'Announcements', icon: <Notifications />, path: '/homeMagang/announcements' },
  ];

export default function Layout({ children }) {
  const location = useLocation(); // Using useLocation to get the current pathname
  const navigate = useNavigate(); // Initialize useNavigate
  // Fungsi logout
  const token = localStorage.getItem("token");
  const user = useSelector((state) => state.auth.user);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await client.get(`api/Mentor/${user.id}/Profile`); // Adjust the base URL if necessary
        console.log(response.data);
        setUserData(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user.id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  const handleLogout = () => {
    // Hapus token atau sesi
    localStorage.removeItem("token"); // Sesuaikan dengan penyimpanan token
    navigate("/"); // Arahkan kembali ke halaman login
  };

  return (
    <Box sx={{ display: 'flex'}}>
            <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            backgroundColor: '#D9D9D9',
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box
            component="img"
            src={userData.user.Profile_Picture
            }
            alt="Profile"
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              mb: 2,
              objectFit: 'cover'
            }}
          />
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 2,
              fontSize: '16px',
              fontWeight: 'normal'
            }}
          >
            Menu
          </Typography>
        </Box>
        <List sx={{ px: 2 }}>
          {menuItems.map((item) => (
            <ListItem
              key={item.text}
              component={Link}
              to={item.path} // Changed href to to
              selected={location.pathname === item.path}
              sx={{
                borderRadius: '8px',
                mb: 1,
                '&.Mui-selected': {
                  backgroundColor: '#e0e0e0',
                },
                '&:hover': {
                  backgroundColor: '#e0e0e0',
                },
              }}
            >
              <ListItemIcon 
                sx={{ 
                  minWidth: 40,
                  '& svg': {
                    fontSize: 20
                  }
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                sx={{
                  '& .MuiListItemText-primary': {
                    fontSize: '14px',
                  }
                }}
              />
            </ListItem>
          ))}
        </List>
        <Button onClick={handleLogout}>
            Logout
        </Button>
      </Drawer>
      <Box component="main" sx={{flexGrow: 3,}}>
        {children}
      </Box>
    </Box>
  );
}

