'use client'

import { useState } from 'react'
import { 
  Box, 
  Typography, 
  Paper, 
  TextField, 
  IconButton, 
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  Menu,
  MenuItem,
} from '@mui/material'
import { Image, Upload, Delete, Add } from '@mui/icons-material'
import Layout from '@/components/layout'

// Question type components
const EssayQuestion = ({ onDelete, number }) => (
  <Paper
    sx={{
      p: 3,
      mb: 2,
      backgroundColor: '#f0f0f0',
      position: 'relative'
    }}
  >
    <Typography variant="subtitle1" sx={{ mb: 2 }}>
      Pertanyaan no{number}
    </Typography>
    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
      <TextField
        fullWidth
        placeholder="Value"
        variant="outlined"
        sx={{ backgroundColor: 'white' }}
      />
      <IconButton>
        <Upload />
      </IconButton>
      <TextField
        placeholder="Score"
        variant="outlined"
        sx={{ width: 100, backgroundColor: 'white' }}
      />
    </Box>
    <TextField
      fullWidth
      multiline
      rows={4}
      placeholder="Value"
      variant="outlined"
      sx={{ backgroundColor: 'white' }}
    />
    <IconButton
      sx={{
        position: 'absolute',
        bottom: 16,
        right: 16,
      }}
      onClick={onDelete}
    >
      <Delete />
    </IconButton>
  </Paper>
)

const MultipleChoiceQuestion = ({ onDelete }) => (
  <Paper
    sx={{
      p: 3,
      mb: 2,
      backgroundColor: '#f0f0f0',
      position: 'relative'
    }}
  >
    <Typography variant="subtitle1" sx={{ mb: 2 }}>
      Soal
    </Typography>
    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
      <TextField
        fullWidth
        placeholder="Value"
        variant="outlined"
        sx={{ backgroundColor: 'white' }}
      />
      <IconButton>
        <Upload />
      </IconButton>
      <TextField
        placeholder="Score"
        variant="outlined"
        sx={{ width: 100, backgroundColor: 'white' }}
      />
    </Box>
    <RadioGroup>
      {[1, 2, 3, 4].map((num) => (
        <FormControlLabel
          key={num}
          value={num.toString()}
          control={<Radio />}
          label={
            <TextField
              fullWidth
              placeholder="Pilihan Jawaban"
              variant="outlined"
              sx={{ ml: 1, backgroundColor: 'white' }}
            />
          }
        />
      ))}
    </RadioGroup>
    <IconButton
      sx={{
        position: 'absolute',
        bottom: 16,
        right: 16,
      }}
      onClick={onDelete}
    >
      <Delete />
    </IconButton>
  </Paper>
)

export default function AddFormPage() {
  const [questions, setQuestions] = useState([])
  const [anchorEl, setAnchorEl] = useState(null)

  const handleAddClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleAddQuestion = (type) => {
    setQuestions([...questions, { id: questions.length + 1, type }])
    handleMenuClose()
  }

  const handleDeleteQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id))
  }

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">ADD FORM</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
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
        </Box>

        <Box sx={{ mb: 4 }}>
          <Paper
            sx={{
              p: 3,
              mb: 3,
              width: 200,
              height: 150,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f0f0f0',
            }}
          >
            <Image sx={{ fontSize: 40, mb: 1 }} />
            <IconButton size="small">
              <Add />
            </IconButton>
          </Paper>

          <TextField
            fullWidth
            label="JUDUL"
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="DESKRIPSI"
            variant="outlined"
            multiline
            rows={4}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="DEADLINE"
            type="datetime-local"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />
        </Box>

        {questions.map((question, index) => (
          question.type === 'essay' ? (
            <EssayQuestion 
              key={question.id}
              number={index + 1}
              onDelete={() => handleDeleteQuestion(question.id)}
            />
          ) : (
            <MultipleChoiceQuestion
              key={question.id}
              onDelete={() => handleDeleteQuestion(question.id)}
            />
          )
        ))}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton
            sx={{
              backgroundColor: '#f0f0f0',
              borderRadius: '8px',
              p: 2,
            }}
            onClick={handleAddClick}
          >
            <Add />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => handleAddQuestion('essay')}>Uraian</MenuItem>
            <MenuItem onClick={() => handleAddQuestion('multiple')}>Pilihan Ganda</MenuItem>
          </Menu>
        </Box>
      </Box>
    </Layout>
  )
}

