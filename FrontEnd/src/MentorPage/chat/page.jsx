
'use client'

import { useState } from 'react'
import { Box, Typography, Paper, TextField, IconButton, Avatar,Grid2 as Grid } from '@mui/material'
import { Send, AttachFile, Camera, Mic, WidthFull } from '@mui/icons-material'
import Layout from '../components/layout'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'

// Mock chat messages data
const initialMessages = [
  {
    id: 1,
    text: "Hai Everyone, my name is......",
    timestamp: "09:30 AM",
    avatar: "/placeholder.svg",
    isSentByMe: true
  },
  {
    id: 2,
    text: "Hello! Welcome to the group chat!",
    timestamp: "09:31 AM",
    avatar: "/placeholder.svg",
    isSentByMe: false
  },
  {
    id: 3,
    text: "Thank you for having me here!",
    timestamp: "09:32 AM",
    avatar: "/placeholder.svg",
    isSentByMe: true
  }
]

const MotionBox = motion.create(Box)

export default function ChatPage() {
  const [messages, setMessages] = useState(initialMessages)
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      message: ''
    }
  })

  const onSubmit = (data) => {
    if (data.message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: data.message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatar: "/placeholder.svg",
        isSentByMe: true
      }
      setMessages([...messages, newMessage])
      reset()
    }
  }

  return (
    <Layout>
      <Grid container sx={{ height: '100vh',display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h4" sx={{ p: 3 }}>Group Chat</Typography>
        {/* Chat messages area */}
        <Box sx={{ 
          flex: 1,  
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          width: '75vw',
        }}>
          <AnimatePresence>
            {messages.map((message) => (
              <MotionBox
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                sx={{
                  display: 'flex',
                  justifyContent: message.isSentByMe ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-start',
                  flexDirection: message.isSentByMe ? 'row' : 'row-reverse',
                  gap: 1,
                  marginLeft: message.isSentByMe ? 'auto' : '0',
                  marginRight: message.isSentByMe ? '0' : 'auto'
                }}
              > 
                <Box sx={{ maxWidth: '70%' }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      backgroundColor: message.isSentByMe ? '#26A69A' : '#f5f5f5',
                      color: message.isSentByMe ? 'white' : 'inherit',
                      borderRadius: '12px',
                      borderTopRightRadius: message.isSentByMe ? '4px' : '12px',
                      borderTopLeftRadius: message.isSentByMe ? '12px' : '4px',
                    }}
                  >
                    <Typography>{message.text}</Typography>
                  </Paper>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      display: 'block', 
                      textAlign: message.isSentByMe ? 'right' : 'left',
                      mt: 0.5,
                      color: 'text.secondary'
                    }}
                  >
                    {message.timestamp}
                  </Typography>
                </Box>
                <Avatar src={message.avatar} />
              </MotionBox>
            ))}
          </AnimatePresence>
        </Box>

        {/* Message input area */}
        <Paper
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            p: 2,
            mx: 3,
            mb: 3,
            display: 'flex',
            gap: 1,
            backgroundColor: '#F8F9FA',
            borderRadius: '12px'
          }}
        >
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              variant="standard"
              placeholder="Type a message..."
              {...register('message', { 
                required: true,
                maxLength: {
                  value: 500,
                  message: 'Message cannot exceed 500 characters'
                }
              })}
              error={!!errors.message}
              helperText={errors.message?.message}
              InputProps={{
                disableUnderline: true,
              }}
              sx={{
                '& .MuiInputBase-root': {
                  padding: '4px 8px',
                },
                '& .MuiFormHelperText-root': {
                  position: 'absolute',
                  bottom: -20
                }
              }}
            />
            <IconButton color="primary" type="submit">
              <Send />
            </IconButton>
            {/* <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }} // Hide the input
              />
                <IconButton type="button" onClick={handleFileInputClick}>
                  <AttachFile />
                </IconButton>
            </div> */}
            <IconButton type="button">
              <AttachFile />
            </IconButton>
            <IconButton type="button">
              <Camera />
            </IconButton>
            <IconButton type="button">
              <Mic />
            </IconButton>
          </Box>
        </Paper>
      </Grid>
    </Layout>
  )
}

