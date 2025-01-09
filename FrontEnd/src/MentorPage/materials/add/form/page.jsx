import { useEffect, useState } from 'react';
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
  Grid,
} from '@mui/material';
import { Image, Upload, Delete, Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Layout from '../../../components/layout';
import { useDispatch, useSelector } from 'react-redux';
import { setMaterial, setGambar, clearMaterial } from '../../../../redux/materialSlice';

// Question type components
const EssayQuestion = ({ onDelete, number, onChange }) => (
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
        onChange={(e) => onChange('question', e.target.value)}
      />
      <IconButton>
        <Upload />
      </IconButton>
      <TextField
        placeholder="Score"
        variant="outlined"
        sx={{ width: 100, backgroundColor: 'white' }}
        onChange={(e) => onChange('score', e.target.value)}
      />
    </Box>
    <TextField
      fullWidth
      multiline
      rows={4}
      placeholder="Value"
      variant="outlined"
      sx={{ backgroundColor: 'white' }}
      onChange={(e) => onChange('answer', e.target.value)}
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
);

const MultipleChoiceQuestion = ({ onDelete, onChange }) => (
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
        onChange={(e) => onChange('question', e.target.value)}
      />
      <IconButton>
        <Upload />
      </IconButton>
      <TextField
        placeholder="Score"
        variant="outlined"
        sx={{ width: 100, backgroundColor: 'white' }}
        onChange={(e) => onChange('score', e.target.value)}
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
              onChange={(e) => onChange(`option${num}`, e.target.value)}
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
);

export default function AddFormPage() {
  const [questions, setQuestions] = useState([]); // Local state for questions
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const material = useSelector((state) => state.material); // Access material state from Redux

  useEffect(() => {
    console.log("Material State:", material);
    console.log("Questions State:", questions);
  }, [material, questions]);

  const handleAddClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAddQuestion = (type) => {
    const newQuestion = {
      id: questions.length + 1,
      type,
      question: '',
      score: '',
      answer: '',
      options: ['', '', '', ''], // For multiple-choice questions
    };
    setQuestions([...questions, newQuestion]);
    handleMenuClose();
  };

  const handleDeleteQuestion = (id) => {
    const updatedQuestions = questions.filter(q => q.id !== id);
    setQuestions(updatedQuestions);
  };

  const handleQuestionChange = (id, field, value) => {
    const updatedQuestions = questions.map(q => {
      if (q.id === id) {
        return { ...q, [field]: value };
      }
      return q;
    });
    setQuestions(updatedQuestions);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(setMaterial({ [name]: value })); // Update Redux state
  };

  const handleSubmit = () => {
    // Log the form data and questions
    console.log('Form Data:', material);
    console.log('Questions:', questions);
    // Clear form after submission (optional)
    dispatch(clearMaterial());
    setQuestions([]); // Clear local questions state
    // Navigate to a different page after submission (optional)
    navigate('/homeMentor/materials');
  };

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
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </Box>
        </Box>
       
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>ADD FORM</Typography>
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
                  name="namaModul"
                  value={material.namaModul || ''}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="DESKRIPSI"
                  variant="outlined"
                  name="Deskripsi"
                  value={material.Deskripsi || ''}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="DEADLINE"
                  variant="outlined"
                  name="Deadline"
                  value={material.Deadline || ''}
                  onChange={handleChange}
                  type="datetime-local"
                  InputLabelProps={{ shrink: true }}
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
              onChange={(field, value) => handleQuestionChange(question.id, field, value)}
            />
          ) : (
            <MultipleChoiceQuestion
              key={question.id}
              onDelete={() => handleDeleteQuestion(question.id)}
              onChange={(field, value) => handleQuestionChange(question.id, field, value)}
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
  );
}

// import { useEffect, useState } from 'react'
// import { 
//   Box, 
//   Typography, 
//   Paper, 
//   TextField, 
//   IconButton, 
//   Button,
//   Radio,
//   RadioGroup,
//   FormControlLabel,
//   Menu,
//   MenuItem,
//   Grid2 as Grid,
// } from '@mui/material'
// import { Image, Upload, Delete, Add } from '@mui/icons-material'
// import { useNavigate } from 'react-router-dom'
// import Layout from '../../../components/layout'
// import { useDispatch, useSelector } from 'react-redux';
// import { setMaterial, setGambar, clearMaterial } from '../../../../redux/materialSlice';
// // Question type components
// const EssayQuestion = ({ onDelete, number }) => (
//   <Paper
//     sx={{
//       p: 3,
//       mb: 2,
//       backgroundColor: '#f0f0f0',
//       position: 'relative'
//     }}
//   >
//     <Typography variant="subtitle1" sx={{ mb: 2 }}>
//       Pertanyaan no{number}
//     </Typography>
//     <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
//       <TextField
//         fullWidth
//         placeholder="Value"
//         variant="outlined"
//         sx={{ backgroundColor: 'white' }}
//       />
//       <IconButton>
//         <Upload />
//       </IconButton>
//       <TextField
//         placeholder="Score"
//         variant="outlined"
//         sx={{ width: 100, backgroundColor: 'white' }}
//       />
//     </Box>
//     <TextField
//       fullWidth
//       multiline
//       rows={4}
//       placeholder="Value"
//       variant="outlined"
//       sx={{ backgroundColor: 'white' }}
//     />
//     <IconButton
//       sx={{
//         position: 'absolute',
//         bottom: 16,
//         right: 16,
//       }}
//       onClick={onDelete}
//     >
//       <Delete />
//     </IconButton>
//   </Paper>
// )

// const MultipleChoiceQuestion = ({ onDelete }) => (
//   <Paper
//     sx={{
//       p: 3,
//       mb: 2,
//       backgroundColor: '#f0f0f0',
//       position: 'relative'
//     }}
//   >
//     <Typography variant="subtitle1" sx={{ mb: 2 }}>
//       Soal
//     </Typography>
//     <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
//       <TextField
//         fullWidth
//         placeholder="Value"
//         variant="outlined"
//         sx={{ backgroundColor: 'white' }}
//       />
//       <IconButton>
//         <Upload />
//       </IconButton>
//       <TextField
//         placeholder="Score"
//         variant="outlined"
//         sx={{ width: 100, backgroundColor: 'white' }}
//       />
//     </Box>
//     <RadioGroup>
//       {[1, 2, 3, 4].map((num) => (
//         <FormControlLabel
//           key={num}
//           value={num.toString()}
//           control={<Radio />}
//           label={
//             <TextField
//               fullWidth
//               placeholder="Pilihan Jawaban"
//               variant="outlined"
//               sx={{ ml: 1, backgroundColor: 'white' }}
//             />
//           }
//         />
//       ))}
//     </RadioGroup>
//     <IconButton
//       sx={{
//         position: 'absolute',
//         bottom: 16,
//         right: 16,
//       }}
//       onClick={onDelete}
//     >
//       <Delete />
//     </IconButton>
//   </Paper>
// )

// export default function AddFormPage() {
//   const [questions, setQuestions] = useState([]);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const material = useSelector((state) => state.material); // Access material state from Redux
//   useEffect(() => {
//     console.log("add materials tolol",material);
//     console.log("add question tolol",questions);
//   })
//   const handleAddClick = (event) => {
//     setAnchorEl(event.currentTarget)
//   }

//   const handleMenuClose = () => {
//     setAnchorEl(null)
//   }

//   const handleAddQuestion = (type) => {
//     setQuestions([...questions, { id: questions.length + 1, type }])
//     handleMenuClose()
//   }

//   const handleDeleteQuestion = (id) => {
//     setQuestions(questions.filter(q => q.id !== id))
//   }
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     dispatch(setMaterial({ [name]: value })); // Update Redux state
//   };
//   return (
//     <Layout>
//       <Box sx={{ p: 3 }}>
//         <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 3 }}>
//           <Box sx={{ display: 'flex', gap: 2 }}>
//             <Button
//               variant="contained"
//               sx={{ backgroundColor: '#e0e0e0', color: 'black' }}
//               onClick={() => navigate(-1)}
//             >
//               Back
//             </Button>
//             <Button variant="contained" color="primary">
//               Submit
//             </Button>
//           </Box>
//         </Box>
       
//         <Box sx={{ mb: 4 }}>
//           <Typography variant="h4"  sx={{ mb: 3, textAlign: 'center' }}>ADD FORM</Typography>
//           <Grid container spacing={3}>
//             <Grid item xs={12} md={6}>
//               <Paper
//                 sx={{
//                   p: 3,
//                   mb: 3,
//                   borderRadius: 1,
//                   textAlign: 'center',
//                   height: '100%',
//                   display: 'flex',
//                   flexDirection: 'column',
//                   justifyContent: 'center',
//                 }}
//               >
//                 <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
//                   <Image sx={{ fontSize: 48, color: '#666' }} />
//                 </Box>
//                   <Typography>Drop your image here or browse</Typography>         
//                   </Paper>
//                     </Grid>
//                     <Grid item xs={12} md={6}>
//                       <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
//                         <TextField
//                           fullWidth
//                           label="JUDUL"
//                           variant="outlined"
//                           name="namaModul"
//                           value={material.namaModul || ''}
//                           onChange={handleChange}
//                           sx={{ mb: 2 }}
//                         />
//                         <TextField
//                           fullWidth
//                           label="DESKRIPSI"
//                           variant="outlined"
//                           name="Deskripsi"
//                           value={material.Deskripsi || ''}
//                           onChange={handleChange}
//                           multiline
//                           rows={4}
//                           sx={{ mb: 2 }}
//                         />
//                         <TextField
//                           fullWidth
//                           label="DEADLINE"
//                           variant="outlined"
//                           name="Deadline"
//                           value={material.Deadline || ''}
//                           onChange={handleChange}
//                           type="datetime-local"
//                         />
//                       </Box>
//                     </Grid>
//                   </Grid>
//               </Box>
//                 {questions.map((question, index) => (
//                   question.type === 'essay' ? (
//                     <EssayQuestion 
//                       key={question.id}
//                       number={index + 1}
//                       onDelete={() => handleDeleteQuestion(question.id)}
//                     />
//                   ) : (
//                     <MultipleChoiceQuestion
//                       key={question.id}
//                       onDelete={() => handleDeleteQuestion(question.id)}
//                     />
//                   )
//                 ))}

//             <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
//           <IconButton
//             sx={{
//               backgroundColor: '#f0f0f0',
//               borderRadius: '8px',
//               p: 2,
//             }}
//             onClick={handleAddClick}
//           >
//             <Add />
//           </IconButton>
//           <Menu
//             anchorEl={anchorEl}
//             open={Boolean(anchorEl)}
//             onClose={handleMenuClose}
//           >
//             <MenuItem onClick={() => handleAddQuestion('essay')}>Uraian</MenuItem>
//             <MenuItem onClick={() => handleAddQuestion('multiple')}>Pilihan Ganda</MenuItem>
//           </Menu>
//         </Box>
//       </Box>
//     </Layout>
//   )
// }

