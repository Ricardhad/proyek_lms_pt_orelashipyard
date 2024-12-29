import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Box, Typography, Paper, TextField, Button, Radio, RadioGroup } from '@mui/material'
import Layout from '../../../../components/layout'

const questions = [
  {
    type: 'essay',
    number: 1,
    questionText: 'Explain the concept of React hooks.',
    answer: 'React hooks are functions that allow you to use state and other React features in functional components. They were introduced in React 16.8 to enable developers to use state and side-effects in functional components, which was previously only possible in class components.',
    score: ''
  },
  {
    type: 'multiple',
    questionText: 'Which of the following is not a built-in React hook?',
    options: ['useState', 'useEffect', 'useContext', 'useHistory'],
    selectedOption: '3',
    score: ''
  },
  {
    type: 'essay',
    number: 2,
    questionText: 'Describe the purpose of the useEffect hook in React.',
    answer: 'The useEffect hook in React is used to perform side effects in functional components. It allows you to execute code after the component has rendered, such as fetching data, subscribing to events, or manually changing the DOM. useEffect can also handle cleanup by returning a function that runs when the component unmounts or when dependencies change.',
    score: ''
  }
]

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
      value={questionText}
      variant="outlined"
      sx={{ 
        mb: 2,
        backgroundColor: 'white',
        '& .MuiOutlinedInput-root': {
          borderRadius: '4px'
        }
      }}
      InputProps={{
        readOnly: true,
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
)

const MultipleChoiceQuestion = ({ questionText, options, selectedOption, score, setScore }) => (
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
      value={questionText}
      variant="outlined"
      sx={{ 
        mb: 2,
        backgroundColor: 'white',
        '& .MuiOutlinedInput-root': {
          borderRadius: '4px'
        }
      }}
      InputProps={{
        readOnly: true,
      }}
    />
    <RadioGroup value={selectedOption} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {options.map((option, index) => (
        <Box
          key={index}
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
            value={index.toString()}
            sx={{
              color: '#757575',
              '&.Mui-checked': {
                color: '#1976d2'
              }
            }}
          />
          <TextField
            fullWidth
            value={option}
            variant="outlined"
            sx={{ 
              '& .MuiOutlinedInput-root': {
                border: 'none',
                '& fieldset': {
                  border: 'none'
                }
              }
            }}
            InputProps={{
              readOnly: true,
            }}
          />
        </Box>
      ))}
    </RadioGroup>
  </Paper>
)

export default function InternFormCheckPage() {
  const [formQuestions, setFormQuestions] = useState(questions)
  const { id, internId } = useParams()
  const navigate = useNavigate()

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
          justifyContent: 'space-between',
          gap: 2,
          mb: 3
        }}>
          <Typography variant="h4">Check Latihan - Material {id} - Intern {internId}</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              sx={{ backgroundColor: '#e0e0e0', color: 'black' }}
              onClick={() => navigate(-1)}
            >
              Back
            </Button>
            <Button variant="contained" color="primary">
              Submit
            </Button>
          </Box>
        </Box>

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
              setScore={(value) => handleScoreChange(index, value)}
            />
          )
        ))}
      </Box>
    </Layout>
  )
}

