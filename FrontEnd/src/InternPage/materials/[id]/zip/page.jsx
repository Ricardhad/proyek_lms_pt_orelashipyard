'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../../../components/layout';
import {
  Box,
  Typography,
  Button,
  Stack,
  Paper,
} from '@mui/material';
import { Upload, Download } from '@mui/icons-material';

export default function MaterialZip({ params }) {
  const router = useRouter();
  const [file, setFile] = useState(null);

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile && uploadedFile.name.endsWith('.zip')) {
      setFile(uploadedFile);
    } else {
      alert('Please upload a .zip file');
    }
  };

  const handleSubmit = () => {
    if (file) {
      console.log('Submitting file:', file);
      // Handle file submission
    } else {
      alert('Please upload a file first');
    }
  };

  return (
    <Layout>
      <Box sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
        <Stack direction="row" justifyContent="space-between" sx={{ mb: 4 }}>
          <Typography variant="h3">Materi {params.id}</Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              color="inherit"
              onClick={() => router.back()}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Stack>
        </Stack>

        <Box sx={{ mb: 4 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
            enim ad minim veniam, quis nostrud exercitation ullamco laboris
            nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
          </Typography>
          <Typography color="error.main" variant="subtitle2">
            DEADLINE : 12:30 pm
          </Typography>
        </Box>

        <Paper
          variant="outlined"
          sx={{
            p: 3,
            borderRadius: 2,
            borderStyle: 'dashed',
            bgcolor: 'background.default'
          }}
        >
          <Stack spacing={2}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                p: 1,
                borderRadius: 1,
                bgcolor: 'grey.100'
              }}
            >
              <Upload />
              <Typography>Upload.zip</Typography>
            </Box>
            
            <Box sx={{ height: 200, bgcolor: 'background.paper', borderRadius: 1 }}>
              <input
                type="file"
                accept=".zip"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
                id="zip-upload"
              />
              <label htmlFor="zip-upload" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                {file ? file.name : 'Drop your files here or click to browse'}
              </label>
            </Box>

            <Button
              variant="contained"
              color="inherit"
              startIcon={<Download />}
              fullWidth
            >
              Download
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Layout>
  );
}

