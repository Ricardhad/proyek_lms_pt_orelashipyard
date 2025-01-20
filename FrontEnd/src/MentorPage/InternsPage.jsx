import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper } from '@mui/material';
import Sidebar from './Sidebar';
import client from "@client";

const InternsPage = () => {
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch intern data using Axios
  useEffect(() => {
    const fetchInterns = async () => {
      try {
        const response = await Client.get('/api/user/all'); // Replace with your API endpoint
        setInterns(response.data);
        console.log(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInterns();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Loading state
  }

  if (error) {
    return <div>Error: {error}</div>; // Error state
  }

  return (
    <div className="flex">
        <Sidebar/>
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
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
              <TableCell>{intern._id}</TableCell>
              <TableCell>
                <div className="flex">
                    <img src={intern.Profile_Picture} alt="Profile" style={{ width: '30px', height: '30px', borderRadius: '50%' }} />
                    <div className="container">
                    {intern.namaUser} <br /><span>{intern.email}</span>
                    </div>
                </div>
              </TableCell>
              <TableCell>{intern.noTelpon}</TableCell>
              <TableCell>Learning and Developer</TableCell>
              <TableCell>
                <Button variant="outlined">Detail</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    </div>
    // <TableContainer component={Paper}>
    //   <Table>
    //     <TableHead>
    //       <TableRow>
    //         <TableCell>ID</TableCell>
    //         <TableCell>Name & Email</TableCell>
    //         <TableCell>Phone Number</TableCell>
    //         <TableCell>Course</TableCell>
    //         <TableCell>Action</TableCell>
    //       </TableRow>
    //     </TableHead>
    //     <TableBody>
    //       {interns.map((intern) => (
    //         <TableRow key={intern.id}>
    //           <TableCell>{intern._id}</TableCell>
    //           <TableCell>
    //             <div className="flex">
    //                 <img src={intern.Profile_Picture} alt="Profile" style={{ width: '30px', height: '30px', borderRadius: '50%' }} />
    //                 <div className="container">
    //                 {intern.namaUser} <br /><span>{intern.email}</span>
    //                 </div>
    //             </div>
    //           </TableCell>
    //           <TableCell>{intern.noTelpon}</TableCell>
    //           <TableCell>Learning and Developer</TableCell>
    //           <TableCell>
    //             <Button variant="outlined">Detail</Button>
    //           </TableCell>
    //         </TableRow>
    //       ))}
    //     </TableBody>
    //   </Table>
    // </TableContainer>
  );
};

export default InternsPage;