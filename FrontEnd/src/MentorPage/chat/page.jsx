'use client'

import { useState } from 'react'
import { Box, Typography, Paper, TextField, IconButton, Avatar } from '@mui/material'
import { Send, AttachFile, Camera, Mic } from '@mui/icons-material'
import Layout from '@/components/layout'

// Mock chat messages data
const initialMessages = [
  {
    id: 1,
    text: "Hai Everyone ,my name is......",
    timestamp: "09:30 AM",
    avatar: "/placeholder.svg"
  },
  {
    id: 2,
    text: "Hai Everyone ,my name is......",
    timestamp: "09:30 AM",
    avatar: "/placeholder.svg"
  },
  {
    id: 3,
    text: "Hai Everyone ,my name is......",
    timestamp: "09:30 AM",
    avatar: "/placeholder.svg"
  }
]

export default function ChatPage() {
  const [messages, setMessages] = useState(initialMessages)
  const [newMessage, setNewMessage] = useState('')

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        text: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatar: "/placeholder.svg"
      }
      setMessages([...messages, message])
      setNewMessage('')
    }
  }

  return (
    <Layout>
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h4" sx={{ p: 3 }}>Group Chat</Typography>
        
        {/* Chat messages area */}
        <Box sx={{ 
          flex: 1, 
          p: 3, 
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}>
          {messages.map((message) => (
            <Box
              key={message.id}
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'flex-start',
                gap: 1
              }}
            >
              <Box sx={{ maxWidth: '70%' }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    backgroundColor: '#26A69A',
                    color: 'white',
                    borderRadius: '12px',
                    borderTopRightRadius: '4px',
                  }}
                >
                  <Typography>{message.text}</Typography>
                </Paper>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    display: 'block', 
                    textAlign: 'right',
                    mt: 0.5,
                    color: 'text.secondary'
                  }}
                >
                  {message.timestamp}
                </Typography>
              </Box>
              <Avatar src={message.avatar} />
            </Box>
          ))}
        </Box>

        {/* Message input area */}
        <Paper
          component="form"
          onSubmit={handleSendMessage}
          sx={{
            p: 2,
            mx: 3,
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            backgroundColor: '#F8F9FA',
            borderRadius: '12px'
          }}
        >
          <TextField
            fullWidth
            variant="standard"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            InputProps={{
              disableUnderline: true,
            }}
            sx={{
              '& .MuiInputBase-root': {
                padding: '4px 8px',
              }
            }}
          />
          <IconButton color="primary" type="submit">
            <Send />
          </IconButton>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
            <Camera />
          </IconButton>
          <IconButton>
            <Mic />
          </IconButton>
        </Paper>
      </Box>
    </Layout>
  )
}

