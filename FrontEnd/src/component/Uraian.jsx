'use client'

import { useState } from 'react'
import {
  Box,
  TextField,
  IconButton,
  Paper,
  InputAdornment,
  Typography,
  styled,
} from '@mui/material'
import { Delete, Upload } from '@mui/icons-material'

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 16,
  backgroundColor: 'rgba(248, 248, 248, 0.9)',
  backdropFilter: 'blur(10px)',
  maxWidth: 800,
}))

const FormField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: 8,
    backgroundColor: '#fff',
  },
})

export default function QuestionForm() {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [score, setScore] = useState('')

  const handleQuestionChange = (event) => {
    setQuestion(event.target.value)
  }

  const handleAnswerChange = (event) => {
    setAnswer(event.target.value)
  }

  const handleScoreChange = (event) => {
    setScore(event.target.value)
  }

  return (
    <StyledPaper elevation={1}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
          Pertanyaan no1
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <FormField
            fullWidth
            placeholder="Value"
            variant="outlined"
            size="small"
            value={question}
            onChange={handleQuestionChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end">
                    <Upload fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <FormField
            placeholder="Score"
            variant="outlined"
            size="small"
            type="number"
            value={score}
            onChange={handleScoreChange}
            sx={{ width: '100px' }}
          />
        </Box>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'stretch', mt: 2 }}>
        <Box sx={{ flex: 1, mb: 2, mr: 2 }}>
          <FormField
            fullWidth
            multiline
            rows={4}
            placeholder="Value"
            variant="outlined"
            value={answer}
            onChange={handleAnswerChange}
          />
        </Box>
        <Box sx={{ alignSelf: 'flex-end', mb: 1 }}>
          <IconButton color="error">
            <Delete />
          </IconButton>
        </Box>
      </Box>
    </StyledPaper>
  )
}

