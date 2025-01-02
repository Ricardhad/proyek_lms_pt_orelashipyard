import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Avatar, Typography } from '@mui/material';
import { AppBar, Toolbar, InputBase } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Layout from '../components/layout';

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

const MotionTableRow = motion(TableRow);

export default function InternsPage() {
  const [interns, setInterns] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const user = useSelector((state) => state.auth.user);
  const intern = [
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
  useEffect(() => {
    const fetchInterns = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/Mentor/${user.id}/Profile`);
        console.log("Mentor Profile Response:", response.data);

        if (response.data.mentor.courseID && response.data.mentor.courseID.length > 0) {
          const courseID = response.data.mentor.courseID[0];

          // Fetch the interns with the courseID and search query
          const params = {};
          if (searchQuery) {
            params.namaUser = searchQuery; // Include the search query as a query parameter
          }

          const response2 = await axios.get(`http://localhost:3000/api/Mentor/${courseID}/AnakMagang`, {
            params: { namaUser: searchQuery }
          });
          console.log("AnakMagang Response:", response2.data);

          if (Array.isArray(response2.data.anakMagang)) {
            const formattedInterns = response2.data.anakMagang.map(intern => ({
              id: intern._id,
              name: intern.userID.namaUser,
              email: intern.userID.email || 'N/A',
              phone: intern.userID.noTelpon,
              course: {
                id: intern.course.id,
                namaCourse: intern.course.namaCourse,
                deskripsi: intern.course.deskripsi,
                mentorID: intern.course.mentorID
              },
              avatar: intern.userID.Profile_Picture || '/placeholder.svg',
              asalSekolah: intern.AsalSekolah,
              absensiKelas: intern.absensiKelas
            }));

            setInterns(formattedInterns);
          } else {
            console.error("Fetched interns response is not an array:", response2.data);
          }
        } else {
          console.error("No courseID found in mentor profile.");
        }
      } catch (error) {
        console.error("Error fetching interns data:", error);
      }
    };

    fetchInterns();
  }, [user.id, searchQuery]);

  useEffect(() => {
    console.log("Interns updated:", interns);
  }, [interns]);



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
                <TableCell>
                  <Typography variant="body2">{intern.course.namaCourse}</Typography>
                </TableCell>
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
    // <Layout>
    //   <AppBar position="static" color="transparent" elevation={3}>
    //     <Toolbar>
    //       <Search>
    //         <SearchIconWrapper>
    //           <SearchIcon />
    //         </SearchIconWrapper>
    //         <StyledInputBase
    //           placeholder="Search Name..."
    //           inputProps={{ 'aria-label': 'search' }}
    //           value={searchQuery}
    //           onChange={(e) => setSearchQuery(e.target.value)}
    //         />
    //       </Search>
    //     </Toolbar>
    //   </AppBar>
    //   <Typography variant="h4" sx={{ p: 3 }}>Interns</Typography>
    //   <TableContainer component={Paper} sx={{ mx: 3 }}>
    //     <Table>
    //       <TableHead>
    //         <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
    //           <TableCell>ID</TableCell>
    //           <TableCell>Name & Email</TableCell>
    //           <TableCell>Phone Number</TableCell>
    //           <TableCell>Course</TableCell>
    //           <TableCell>Action</TableCell>
    //         </TableRow>
    //       </TableHead>
    //       <TableBody>
    //         {intern.map((intern, index) => (
    //           <MotionTableRow 
    //             key={intern._id}
    //             initial={{ opacity: 0, x: -20 }}
    //             animate={{ opacity: 1, x: 0 }}
    //             transition={{ duration: 0.3, delay: index * 0.1 }}
    //             whileHover={{ scale: 0.9 }}
    //           >
    //             <TableCell>{intern.id}</TableCell>
    //             <TableCell>
    //               <motion.div 
    //                 style={{ display: 'flex', alignItems: 'center', gap: 12 }}
    //                 whileHover={{ x: 5 }}
    //                 transition={{ duration: 0.2 }}
    //               >
    //                 <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
    //                   <Avatar src={intern.avatar} alt={intern.name} />
    //                 </motion.div>
    //                 <div>
    //                   <Typography variant="subtitle2">{intern.name}</Typography>
    //                   <Typography variant="body2" color="textSecondary">
    //                     {intern.email}
    //                   </Typography>
    //                 </div>
    //               </motion.div>
    //             </TableCell>
    //             <TableCell>{intern.phone}</TableCell>
    //             <TableCell>{intern.course}</TableCell>
    //             <TableCell>
    //               <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
    //                 <Button
    //                   variant="contained"
    //                   size="small"
    //                   sx={{ backgroundColor: '#e0e0e0', color: 'black' }}
    //                   component={Link}
    //                   to={`/homeMentor/interns/${intern.id}`}
    //                 >
    //                   Detail
    //                 </Button>
    //               </motion.div>
    //             </TableCell>
    //           </MotionTableRow>
    //         ))}
    //       </TableBody>
    //     </Table>
    //   </TableContainer>
    // </Layout>
  );
}