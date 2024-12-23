import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../../main-layout';
import {
  Box,
  Typography,
  Button,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Stack,
  Paper,
} from '@mui/material';

export default function MaterialForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    question1: '',
    question2: '',
    multipleChoice: '',
  });

  const handleInputChange = (e, field) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission
  };

  return (
    <MainLayout>
      <Box sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
        <Stack direction="row" justifyContent="space-between" sx={{ mb: 4 }}>
          <Typography variant="h3">Materi {id}</Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              color="inherit"
              onClick={() => navigate(-1)}
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

        <Paper elevation={0} sx={{ p: 3, mb: 4, bgcolor: '#f5f5f5' }}>
          <Box sx={{ width: 200, height: 150, bgcolor: 'grey.300', mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography color="text.secondary">Image Placeholder</Typography>
          </Box>
          <Typography variant="body1" paragraph>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
            enim ad minim veniam, quis nostrud exercitation ullamco laboris
            nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
          </Typography>
          <Typography color="error.main" variant="subtitle2">
            DEADLINE : 12:30 pm
          </Typography>
        </Paper>

        <Stack spacing={3}>
          <Paper elevation={0} sx={{ p: 3, bgcolor: '#f5f5f5' }}>
            <Typography variant="subtitle1" gutterBottom>
              Pertanyaan no1
            </Typography>
            <TextField
              fullWidth
              placeholder="Value"
              value={formData.question1}
              onChange={(e) => handleInputChange(e, 'question1')}
              variant="outlined"
              sx={{ mb: 2, bgcolor: 'background.paper' }}
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Value"
              value={formData.question1Answer}
              onChange={(e) => handleInputChange(e, 'question1Answer')}
              variant="outlined"
              sx={{ mb: 2, bgcolor: 'background.paper' }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <TextField
                label="Score"
                size="small"
                sx={{ width: 100, bgcolor: 'background.paper' }}
              />
            </Box>
          </Paper>

          <Paper elevation={0} sx={{ p: 3, bgcolor: '#f5f5f5' }}>
            <Typography variant="subtitle1" gutterBottom>
              Soal
            </Typography>
            <TextField
              fullWidth
              placeholder="Value"
              value={formData.question2}
              onChange={(e) => handleInputChange(e, 'question2')}
              variant="outlined"
              sx={{ mb: 2, bgcolor: 'background.paper' }}
            />
            
            <FormControl component="fieldset" fullWidth>
              <RadioGroup
                value={formData.multipleChoice}
                onChange={(e) => handleInputChange(e, 'multipleChoice')}
              >
                {['A', 'B', 'C', 'D'].map((option) => (
                  <FormControlLabel
                    key={option}
                    value={option}
                    control={<Radio />}
                    label={
                      <TextField
                        fullWidth
                        placeholder="Pilihan Jawaban"
                        variant="outlined"
                        sx={{ ml: 1, bgcolor: 'background.paper' }}
                      />
                    }
                  />
                ))}
              </RadioGroup>
            </FormControl>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <TextField
                label="Score"
                size="small"
                sx={{ width: 100, bgcolor: 'background.paper' }}
              />
            </Box>
          </Paper>
        </Stack>
      </Box>
    </MainLayout>
  );
}

