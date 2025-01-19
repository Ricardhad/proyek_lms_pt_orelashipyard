import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, TextField, Button, Radio, RadioGroup } from '@mui/material';
import Layout from '../../../../components/layout';
import { useSelector } from 'react-redux';
import client from '../../../../../client';

const EssayQuestion = ({ number, questionText, answer, score, setScore }) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      mb: 2,
      backgroundColor: '#f5f5f5',
      borderRadius: '16px',
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
      <Typography>Soal</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography>Score</Typography>
        <TextField
          value={score}
          onChange={(e) => {
            const newValue = e.target.value;
            if (!isNaN(newValue) && newValue !== '' && Number(newValue) >= 0) {
              setScore(Number(newValue)); // Convert value to number and update state
            }
          }}
          variant="outlined"
          size="small"
          type="number" // Accepts only numbers
          inputProps={{
            min: 0,
            max: score, // Same as maxScore
          }}
          sx={{
            width: '75px',
            backgroundColor: 'white',
            '& .MuiOutlinedInput-root': {
              borderRadius: '4px',
            },
          }}
        />
      </Box>
    </Box>
    <TextField
      fullWidth
      value={questionText}
      variant="outlined"
      sx={{
        mb: 2,
        backgroundColor: 'white',
        '& .MuiOutlinedInput-root': {
          borderRadius: '4px',
        },
      }}
    />
    <TextField
      fullWidth
      multiline
      rows={4}
      value={answer}
      variant="outlined"
      sx={{
        backgroundColor: 'white',
        '& .MuiOutlinedInput-root': {
          borderRadius: '4px',
        },
      }}
      InputProps={{
        readOnly: true,
      }}
    />
  </Paper>
);

const MultipleChoiceQuestion = ({ questionText, options, selectedOption, score, kunciJawaban }) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      mb: 2,
      backgroundColor: '#f5f5f5',
      borderRadius: '16px',
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
      <Typography>Soal</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography>Score</Typography>
        {selectedOption === kunciJawaban ? (
          <Typography>{score}</Typography>
        ) : (
          <Typography>0</Typography>
        )}
      </Box>
    </Box>

    <Typography sx={{ mb: 2 }}>{questionText}</Typography>

    <RadioGroup value={selectedOption} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {options.map((option, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor:
              option === kunciJawaban
                ? '#c8e6c9'
                : selectedOption === option
                ? '#f8d7da'
                : 'white',
            borderRadius: '4px',
            pl: 1,
          }}
        >
          <Radio
            value={option}
            checked={option === selectedOption}
            disabled
            sx={{
              color: '#757575',
              '&.Mui-checked': {
                color: '#1976d2',
              },
            }}
          />
          <Typography sx={{ flex: 1, ml: 1 }}>{option}</Typography>
        </Box>
      ))}
    </RadioGroup>

    {selectedOption === kunciJawaban ? (
      <Typography sx={{ mb: 1, mt: 3, fontWeight: 'bold', color: '#49e52a' }}>
        Kunci Jawaban: {kunciJawaban}
      </Typography>
    ) : (
      <Typography sx={{ mb: 1, mt: 3, fontWeight: 'bold', color: '#ff6b6b' }}>
        Kunci Jawaban: {kunciJawaban}
      </Typography>
    )}
  </Paper>
);

export default function InternFormCheckPage() {
  const { id, internId } = useParams();
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [formQuestions, setFormQuestions] = useState([]);
  const [scores, setScore] = useState(0);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await client.get(`api/mentor/jawaban-modul/${id}/${internId}`);
        console.log('Response question received:', response.data);
        const fetchedQuestions = response.data.data.map((jawaban) => {
          const soalType = jawaban.soalModulID.SoalType;
          return soalType === 0
            ? {
                type: 'multiple',
                questionText: jawaban.soalModulID.Soal,
                options: jawaban.soalModulID.Pilihan,
                selectedOption: jawaban.jawaban,
                score: jawaban.soalModulID.nilai,
                kunciJawaban: jawaban.soalModulID.kunciJawaban,
              }
            : {
                type: 'essay',
                number: jawaban.soalModulID._id,
                questionText: jawaban.soalModulID.Soal,
                answer: jawaban.jawaban,
                score: jawaban.soalModulID.nilai,
              };
        });
        setFormQuestions(fetchedQuestions);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, [id, internId]);
  useEffect(() => {
    console.log('formQuestions score:',scores);
  })

  const handleScoreChange = (index, value) => {
    const newQuestions = [...formQuestions];
    newQuestions[index].score = value;

    const newTotalScore = newQuestions.reduce((total, question) => {
      return question.type === 'essay' ? total + Number(question.score || 0) : total;
    }, 0);

    setFormQuestions(newQuestions);
    setScore(newTotalScore);
  };
  const handleSubmit = async () => {
    try {
      const responseprofile = await client.get(`api/mentor/${user.id}/Profile`); // Adjust the base URL if necessary
        console.log("profile check",responseprofile.data.mentor._id);
      const response = await client.put(`api/mentor/${id}/${internId}/submit-check`, {
        mentorID: responseprofile.data.mentor._id,
        incrementValue: scores,
      });
      console.log('Update success:', response.data);
      alert('Successfully submitted!');
      navigate(-1);
    } catch (error) {
      console.error('Error submitting data:', error);
      alert('Failed to submit. Please try again.');
    }
  };

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mb: 3 }}>
          <Typography variant="h4">Check Latihan</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#e0e0e0',
                color: 'black',
                '&:hover': { backgroundColor: '#d6d6d6' },
              }}
              onClick={() => navigate(-1)}
            >
              Back
            </Button>
            <Button variant="contained" color="primary" 
            onClick={() => {
              handleSubmit();
              navigate(-1);
            }}>
              Submit
            </Button>
          </Box>
        </Box>

        {formQuestions.map((question, index) =>
          question.type === 'essay' ? (
            <EssayQuestion
              key={index}
              number={question.number}
              questionText={question.questionText}
              answer={question.answer}
              score={question.score}
              setScore={(value) => handleScoreChange(index, value)}
            />
          ) : (
            <MultipleChoiceQuestion
              key={index}
              questionText={question.questionText}
              options={question.options}
              selectedOption={question.selectedOption}
              score={question.score}
              kunciJawaban={question.kunciJawaban}
            />
          )
        )}
      </Box>
    </Layout>
  );
}
