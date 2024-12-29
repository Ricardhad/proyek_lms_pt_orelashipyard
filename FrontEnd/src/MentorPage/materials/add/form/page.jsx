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
  Grid2 as Grid,
} from '@mui/material'
import { Image, Upload, Delete, Add } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import Layout from '../../../components/layout'

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
  const navigate = useNavigate()

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
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 3 }}>
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
       
        <Box sx={{ mb: 4 }}>
           <Typography variant="h4"  sx={{ mb: 3, textAlign: 'center' }}>ADD FORM</Typography>
      <Grid container spacing={3}>
  <Grid item xs={12} md={6}>
    <Paper
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 1,
        textAlign: 'center',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
  <Image sx={{ fontSize: 48, color: '#666' }} />
</Box>
      <Typography>Drop your image here or browse</Typography>
            
</Paper>
  </Grid>
  <Grid item xs={12} md={6}>
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
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
        variant="outlined"
        type="datetime-local"
      />
    </Box>
  </Grid>
</Grid>
          
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

