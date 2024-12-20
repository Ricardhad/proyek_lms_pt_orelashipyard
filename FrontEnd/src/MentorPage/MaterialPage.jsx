import React, { useEffect, useState } from 'react';
import { Button, Card, CardContent, Typography, TextField, Box, CircularProgress } from '@mui/material';
import Sidebar from './Sidebar';    
import axios from 'axios';

const MaterialPage = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch materials using Axios
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await axios.get('https://api.example.com/materials'); // Replace with your API endpoint
        setMaterials(response.data);
        console.log(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, []);

  if (loading) {
    return <CircularProgress />; // Loading state
  }

  if (error) {
    return <div>Error: {error}</div>; // Error state
  }

  return (
    <div>
    <Sidebar/>
      <div className="flex items-center justify-between mb-4">
        <TextField label="Search" variant="outlined" />
      </div>
      <Box display="flex" flexWrap="wrap" spacing={2}>
        {/* Material Cards */}
        {materials.map((item, index) => (
          <Box key={index} width={{ xs: '100%', sm: '50%', md: '33.33%' }} p={1}>
            <Card className="p-4">
              <CardContent>
                <Typography variant="h5">{item.name}</Typography>
                <Typography color="textSecondary">Deadline: {item.deadline}</Typography>
                <Button variant="contained" color="primary" className="mt-2">
                  Tag
                </Button>
              </CardContent>
            </Card>
          </Box>
        ))}
        {/* Add Material Button */}
        <Box width={{ xs: '100%', sm: '50%', md: '33.33%' }} p={1}>
          <Card className="p-4 flex items-center justify-center">
            <Button variant="contained" color="secondary">
              TAMBAH MATERI
            </Button>
          </Card>
        </Box>
      </Box>
    </div>
  );
};

export default MaterialPage;