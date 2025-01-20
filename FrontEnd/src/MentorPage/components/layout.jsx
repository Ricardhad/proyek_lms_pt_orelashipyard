'use client'

import { Avatar, Box, Drawer, List, ListItem, ListItemIcon, ListItemText, AppBar, Toolbar, IconButton, InputBase, Typography ,Button} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Person, Book, Group, Search as SearchIcon } from '@mui/icons-material';
import { MessageCircle, BellRing } from 'lucide-react';
import { Link,useLocation,useNavigate} from 'react-router-dom'; // Changed to react-router-dom
// import { useLocation,useNavigate } from 'react-router-dom'; // To get the current path
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import client from "@client";

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

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    width: '100%',
  },
}));

const menuItems = [
  { text: 'My Profile', icon: <Person />, path: '/homeMentor/' },
  { text: 'Materials', icon: <Book />, path: '/homeMentor/materials' },
  { text: 'My Intern', icon: <Group />, path: '/homeMentor/interns' },
  { text: 'Group Chat', icon: <MessageCircle />, path: '/homeMentor/chat' },
  { text: 'Add Announcement', icon: <BellRing />, path: '/homeMentor/announcements' },
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
    <Box sx={{ display: 'flex' }}>
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
      <Box component="main" sx={{ flexGrow: 3 }}>
        {/* <AppBar position="static" color="reansparent" elevation={3}>
          <Toolbar>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search..."
                inputProps={{ 'aria-label': 'search' }}
              />
            </Search>
          </Toolbar>
        </AppBar> */}
        {children}
      </Box>
    </Box>
  );
}