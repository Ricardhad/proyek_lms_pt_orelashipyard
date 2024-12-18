'use client'

import { useState } from 'react'
import { Box, Typography, Paper, TextField, Button, Radio, RadioGroup } from '@mui/material'
import Layout from '@/components/layout'

const questions = [
  {
    type: 'essay',
    number: 1,
    questionText: '',
    answer: '',
    score: ''
  },
  {
    type: 'multiple',
    questionText: '',
    options: ['', '', '', ''],
    selectedOption: '',
    score: ''
  },
  {
    type: 'essay',
    number: 2,
    questionText: '',
    answer: '',
    score: ''
  }
]

const EssayQuestion = ({ number, score, setScore }) => (
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
      <Typography>Pertanyaan no{number}</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography>Score</Typography>
        <TextField
          value={score}
          onChange={(e) => setScore(e.target.value)}
          variant="outlined"
          size="small"
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
      placeholder="Value"
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
      placeholder="Value"
      variant="outlined"
      sx={{ 
        backgroundColor: 'white',
        '& .MuiOutlinedInput-root': {
          borderRadius: '4px'
        }
      }}
    />
  </Paper>
)

const MultipleChoiceQuestion = ({ score, setScore }) => (
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
          onChange={(e) => setScore(e.target.value)}
          variant="outlined"
          size="small"
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
      placeholder="Value"
      variant="outlined"
      sx={{ 
        mb: 2,
        backgroundColor: 'white',
        '& .MuiOutlinedInput-root': {
          borderRadius: '4px'
        }
      }}
    />
    <RadioGroup sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {[1, 2, 3, 4].map((num) => (
        <Box
          key={num}
          sx={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'white',
            borderRadius: '4px',
            pl: 1,
            '&:hover': {
              backgroundColor: '#fafafa'
            }
          }}
        >
          <Radio 
            value={num.toString()}
            sx={{
              color: '#757575',
              '&.Mui-checked': {
                color: '#1976d2'
              }
            }}
          />
          <TextField
            fullWidth
            placeholder="Pilihan Jawaban"
            variant="outlined"
            sx={{ 
              '& .MuiOutlinedInput-root': {
                border: 'none',
                '& fieldset': {
                  border: 'none'
                }
              }
            }}
          />
        </Box>
      ))}
    </RadioGroup>
  </Paper>
)

export default function InternFormCheckPage() {
  const [formQuestions, setFormQuestions] = useState(questions)

  const handleScoreChange = (index, value) => {
    const newQuestions = [...formQuestions]
    newQuestions[index].score = value
    setFormQuestions(newQuestions)
  }

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'flex-end',
          gap: 2,
          mb: 3
        }}>
          <Button
            variant="contained"
            sx={{ backgroundColor: '#e0e0e0', color: 'black' }}
          >
            Back
          </Button>
          <Button variant="contained" color="primary">
            Submit
          </Button>
        </Box>

        {formQuestions.map((question, index) => (
          question.type === 'essay' ? (
            <EssayQuestion
              key={index}
              number={question.number}
              score={question.score}
              setScore={(value) => handleScoreChange(index, value)}
            />
          ) : (
            <MultipleChoiceQuestion
              key={index}
              score={question.score}
              setScore={(value) => handleScoreChange(index, value)}
            />
          )
        ))}
      </Box>
    </Layout>
  )
}

