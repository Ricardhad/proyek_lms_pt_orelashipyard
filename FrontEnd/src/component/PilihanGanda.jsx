'use client'

import React, { useState } from 'react'
import {
  Box,
  TextField,
  IconButton,
  Paper,
  InputAdornment,
  styled,
  Radio,
} from '@mui/material'
import { Delete, Upload } from '@mui/icons-material'

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 16,
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  maxWidth: 500,
}))

const FormField = styled(TextField)({
  marginBottom: 12,
  '& .MuiOutlinedInput-root': {
    borderRadius: 8,
  },
})

export default function SealForm() {
  const [fields, setFields] = useState(['', '', '', ''])
  const [score, setScore] = useState('')
  const [selectedField, setSelectedField] = useState(null)

  const handleFieldChange = (index, value) => {
    const newFields = [...fields]
    newFields[index] = value
    setFields(newFields)
  }

  const handleScoreChange = (event) => {
    setScore(event.target.value)
  }

  const handleRadioChange = (index) => {
    setSelectedField(index)
  }

  return (
    <StyledPaper elevation={2}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <FormField
          fullWidth
          label="Seal"
          variant="outlined"
          size="small"
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
          variant="outlined"
          size="small"
          type="number"
          value={score}
          onChange={handleScoreChange}
          sx={{ ml: 2, width: '80px' }}
        />
      </Box>

      {fields.map((field, index) => (
        <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Radio
            checked={selectedField === index}
            onChange={() => handleRadioChange(index)}
            value={index}
            name="radio-buttons"
            size="small"
          />
          <FormField
            fullWidth
            placeholder="Pathan Jewathan"
            variant="outlined"
            value={field}
            onChange={(e) => handleFieldChange(index, e.target.value)}
            size="small"
          />
        </Box>
      ))}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <IconButton color="error">
          <Delete />
        </IconButton>
      </Box>
    </StyledPaper>
  )
}

