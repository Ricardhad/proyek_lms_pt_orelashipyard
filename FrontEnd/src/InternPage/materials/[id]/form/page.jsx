import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import client from "@client";
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
  const { id } = useParams(); // id corresponds to modulID
  const user = useSelector((state) => state.auth.user); // Fetch logged-in user data from Redux
  const [userData, setUserData] = useState(null);
  const [modulData, setModulData] = useState(null);
  const [formData, setFormData] = useState({});
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await client.get(`api/anakMagang/${user.id}/Profile`);
        setUserData(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'An error occurred while fetching user profile');
      }
    };

    const fetchModulData = async () => {
      try {
        const response = await client.get(`api/anakMagang/modul/${id}/getformmodule`);
        setModulData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch modul data');
      }
    };

    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchUserData(), fetchModulData()]);
      } catch (err) {
        console.error('Error during data fetch:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.id, id]);

  const handleInputChange = (e, soalModulID, soalType) => {
    const value = e.target.value;
    const jawabanType = soalType; // Convert to number (0 for multiple-choice, 1 for essay)

    setFormData((prev) => ({ ...prev, [soalModulID]: value }));

    setAnswers((prev) => {
      const existingAnswerIndex = prev.findIndex((answer) => answer.soalModulID === soalModulID);
      const newAnswer = {
        courseID: modulData?.courseID || '',
        modulID: modulData?._id || '',
        anakMagangID: userData?.anakMagang._id || '',
        soalModulID,
        jawaban: value,
        jawabanType,
      };

      if (existingAnswerIndex !== -1) {
        const updatedAnswers = [...prev];
        updatedAnswers[existingAnswerIndex] = newAnswer;
        return updatedAnswers;
      }

      return [...prev, newAnswer];
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await client.post('api/anakMagang/submit-answers', {
        courseID: modulData?.courseID,
        modulID: modulData?._id,
        anakMagangID: userData?.anakMagang._id,
        answers,
      });
      console.log('Submission successful:', response.data);
      alert('Submission successful');
    } catch (err) {
      console.error('Error submitting answers:', err);
      alert('An error occurred while submitting answers');
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
                <TextField
                  fullWidth
                  placeholder="Your Answer"
                  value={formData[soal._id] || ''}
                  onChange={(e) => handleInputChange(e, soal._id, soal.SoalType)}
                  variant="outlined"
                  sx={{ mb: 2, bgcolor: 'background.paper' }}
                />
              ) : soal.SoalType === 0 && soal.Pilihan ? (
                <FormControl component="fieldset" fullWidth>
                  <RadioGroup
                    value={formData[soal._id] || ''}
                    onChange={(e) => handleInputChange(e, soal._id, soal.SoalType)}
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
