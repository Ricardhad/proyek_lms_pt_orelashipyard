import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Layout from '../../../components/layout';
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
  const { id } = useParams(); // id corresponds to the modulID
  const [formData, setFormData] = useState({});
  const [modulData, setModulData] = useState(null);
  const [answers, setAnswers] = useState([]); // State for answers with soalModulID, jawaban, jawabanType
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from the API
    const fetchModulData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/anakMagang/modul/${id}/getformmodule`);
        console.log('modulData:', response.data);
        setModulData(response.data);
      } catch (err) {
        console.error('Error fetching modul data:', err);
        setError(err.response?.data?.message || 'Failed to fetch modul data');
      } finally {
        setLoading(false);
      }
    };

    fetchModulData();
  }, [id]);

  const handleInputChange = (e, soalModulID, jawabanType) => {
    const value = e.target.value;

    // Update formData for convenience
    setFormData((prev) => ({ ...prev, [soalModulID]: value }));

    // Update answers array with soalModulID, jawaban, and jawabanType
    setAnswers((prev) => {
      const existingAnswerIndex = prev.findIndex((answer) => answer.soalModulID === soalModulID);
      if (existingAnswerIndex !== -1) {
        // Update the existing answer
        const updatedAnswers = [...prev];
        updatedAnswers[existingAnswerIndex] = { soalModulID, jawaban: value, jawabanType };
        return updatedAnswers;
      }
      // Add a new answer
      return [...prev, { soalModulID, jawaban: value, jawabanType }];
    });
  };

  useEffect(() => {
    console.log('answers:', answers);
  }, [answers]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    console.log('Answers submitted:', answers);

    try {
      // Post answers to the backend
      await axios.post(`http://localhost:3000/api/anakMagang/jawabanmodul`, {
        courseID: modulData.courseID,
        anakMagangID: modulData.anakMagangID,
        answers, // Send the structured answers
      });
      alert('Answers submitted successfully!');
      navigate(-1); // Navigate back
    } catch (err) {
      console.error('Error submitting answers:', err);
      alert('Failed to submit answers.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Layout>
      <Box sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
        <Stack direction="row" justifyContent="space-between" sx={{ mb: 4 }}>
          <Typography variant="h3">Materi {modulData?.namaModul || id}</Typography>
          <Stack direction="row" spacing={2}>
            <Button variant="contained" color="inherit" onClick={() => navigate(-1)}>
              Back
            </Button>
            <Button variant="contained" onClick={handleSubmit}>
              Submit
            </Button>
          </Stack>
        </Stack>

        <Paper elevation={0} sx={{ p: 3, mb: 4, bgcolor: '#f5f5f5', display: 'flex' }}>
          <Box
            sx={{
              width: 200,
              height: 150,
              bgcolor: 'grey.300',
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography color="text.secondary">Image Placeholder</Typography>
          </Box>
          <Box sx={{ width: 600, height: 150, mb: 2, ml: 2 }}>
            <Typography variant="body1" paragraph>
              {modulData?.Deskripsi || 'No description available'}
            </Typography>
            <Typography color="error.main" variant="subtitle2">
              DEADLINE: {new Date(modulData?.Deadline).toLocaleString() || 'N/A'}
            </Typography>
          </Box>
        </Paper>

        <Stack spacing={3}>
          {modulData?.soalID?.map((soal, index) => (
            <Paper key={soal._id} elevation={0} sx={{ p: 3, bgcolor: '#f5f5f5' }}>
              <Typography variant="subtitle1" gutterBottom>
                Pertanyaan {index + 1}: {soal.Soal}
              </Typography>
              {soal.SoalType === 1 ? (
                // Render TextField for SoalType: 1
                <TextField
                  fullWidth
                  placeholder="Your Answer"
                  value={formData[soal._id] || ''}
                  onChange={(e) => handleInputChange(e, soal._id, 'essay')}
                  variant="outlined"
                  sx={{ mb: 2, bgcolor: 'background.paper' }}
                />
              ) : soal.SoalType === 0 && soal.Pilihan ? (
                // Render RadioGroup for SoalType: 0
                <FormControl component="fieldset" fullWidth>
                  <RadioGroup
                    value={formData[soal._id] || ''}
                    onChange={(e) => handleInputChange(e, soal._id, 'file')}
                  >
                    {soal.Pilihan.map((option, optIndex) => (
                      <FormControlLabel
                        key={optIndex}
                        value={option}
                        control={<Radio />}
                        label={option}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              ) : (
                // Fallback for missing or unsupported SoalType
                <Typography variant="body2" color="text.secondary">
                  Unsupported question type or missing options.
                </Typography>
              )}
            </Paper>
          ))}
        </Stack>
      </Box>
    </Layout>
  );
}
