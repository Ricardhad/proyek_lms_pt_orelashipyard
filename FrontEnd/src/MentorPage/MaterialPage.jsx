import React, { useEffect, useState } from 'react';
import { Button, Card, CardContent, Typography, TextField, Box, CircularProgress } from '@mui/material';
import Sidebar from './Sidebar';    
import client from '../client';

const MaterialPage = () => {
  const [materials, setMaterials] = useState([]); // Ensure materials is initialized as an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch materials using Axios
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await client.get('/api/Mentor/Modul', {
          params: {
            filter: searchTerm, // Add your query parameter here
          },
        });
        // Ensure response.data is an array before setting state
        if (Array.isArray(response.data)) {
          setMaterials(response.data);
        } else {
          throw new Error("Unexpected response format");
        }
      } catch (err) {
        setError("Failed to fetch materials: " + err.message); // Set a friendly error message
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, [searchTerm]); // Fetch materials whenever searchTerm changes

  if (loading) {
    return <CircularProgress />; // Loading state
  }

  if (error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error}</p> {/* Display the error message */}
      </div>
    ); // Error state
  }

  return (
    <div>
      <Sidebar />
      <div className="flex items-center justify-between mb-4">
        <TextField 
          label="Search" 
          variant="outlined" 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} // Update searchTerm on input change
        />
      </div>
      <Box display="flex" flexWrap="wrap" spacing={2}>
        {/* Material Cards */}
        {materials.length > 0 ? (
          materials.map((item, index) => (
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
          ))
        ) : (
          <Typography variant="h6">No materials found.</Typography> // Fallback message if no materials
        )}
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