import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'
import { Box, Typography, Paper, TextField, Button, Radio, RadioGroup } from '@mui/material'
import Layout from '../../../../components/layout'
import axios from 'axios'

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
      <Typography>soal</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography>Score</Typography>
        <TextField
          value={score}
          onChange={(e) => {
            // Ensure the value entered is a number
            if (!isNaN(e.target.value) || e.target.value === '') {
              setScore(e.target.value);
            }
          }}
          variant="outlined"
          size="small"
          type="number"  // Accepts only numbers
          sx={{ 
            width: '60px',
            backgroundColor: 'white',
            '& .MuiOutlinedInput-root': {
              borderRadius: '4px'
            }
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
          borderRadius: '4px'
        }
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
          borderRadius: '4px'
        }
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

    {/* Display the question */}
    <Typography sx={{ mb: 2 }}>{questionText}</Typography>

    {/* Options with Radio Buttons */}
    <RadioGroup value={selectedOption} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {options.map((option, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 
              option === kunciJawaban 
                ? '#c8e6c9' // Green for correct answer
                : selectedOption === option
                ? '#f8d7da' // Red for incorrect selected answer
                : 'white', // Default white for unselected options
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

    {/* Correct Answer Display */}
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
  const navigate = useNavigate();
  const [formQuestions, setFormQuestions] = useState([]);
  const [score, setScore] = useState(0);
  

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/mentor/jawaban-modul/${id}/${internId}`);
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
                score: '',
              };
        });
        setFormQuestions(fetchedQuestions);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, [id, internId]);


  const handleScoreChange = (index, value) => {
    const newQuestions = [...formQuestions]
    newQuestions[index].score = value
    setFormQuestions(newQuestions)
  }

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        {/* Header Section */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 2,
            mb: 3,
          }}
        >
          <Typography variant="h4">
            Check Latihan
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {/* Back Button */}
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
            {/* Submit Button */}
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleSubmit()}
            >
              Submit
            </Button>
          </Box>
        </Box>
            
        {/* Question List */}
        {formQuestions.map((question, index) => (
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
        ))}
      </Box>
    </Layout>
  )
}

