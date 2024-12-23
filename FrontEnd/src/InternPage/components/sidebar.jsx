import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Box,
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
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { text: 'Profile', icon: <Person />, path: '/homeMagang/' },
    { text: 'Edit Profile', icon: <Edit />, path: '/homeMagang/edit-profile' },
    { text: 'Materials', icon: <Book />, path: '/homeMagang/materials' },
    { text: 'Homework', icon: <Assignment />, path: '/homeMagang/homework' },
    { text: 'Group Chat', icon: <Chat />, path: '/homeMagang/group-chat' },
    { text: 'Announcements', icon: <Notifications />, path: '/homeMagang/announcements' },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          backgroundColor: '#f0f0f0',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Avatar
          src="/placeholder.svg"
          sx={{ width: 64, height: 64, mb: 2, mx: 'auto' }}
        />
        <Typography variant="h6" align="center">
          Menu
        </Typography>
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            component={Link}
            to={item.path}
            selected={location.pathname === item.path}
            sx={{
              '&.Mui-selected': {
                backgroundColor: 'rgba(0, 0, 0, 0.08)',
              },
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}

