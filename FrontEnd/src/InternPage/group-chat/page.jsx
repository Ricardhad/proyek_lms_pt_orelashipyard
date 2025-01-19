
'use client'

// import { useState } from 'react'
// import { Box, Typography, Paper, TextField, IconButton, Avatar,Grid2 as Grid } from '@mui/material'
// import { Send, AttachFile, Camera, Mic, WidthFull } from '@mui/icons-material'
// import Layout from '../components/layout'
// import { motion, AnimatePresence } from 'framer-motion'
// import { useForm } from 'react-hook-form'

import { useState, useEffect } from 'react';
import { Box, Typography, Paper, TextField, IconButton, Avatar, Grid2 as Grid } from '@mui/material';
import { Send, AttachFile, Camera, Mic } from '@mui/icons-material';
import Layout from '../components/layout';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';
import client from '../../client';

const MotionBox = motion.create(Box)

export default function ChatPage() {
  const user = useSelector((state) => state.auth.user);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      message: ''
    }
  });

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io('http://localhost:3000', {
      cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true
      },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });
  
    newSocket.on('connect', () => {
      console.log('Connected to socket server');
    });
  
    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setError('Unable to connect to chat server');
    });
  
    setSocket(newSocket);
  
    return () => {
      newSocket.close();
    };
  }, []);

  // Fetch initial data and setup message listener
  useEffect(() => {
    if (!socket || !user?.id) return;

    const fetchData = async () => {
      try {
        // Fetch user profile data
        const userResponse = await client.get(`api/anakMagang/${user.id}/Profile`);
        console
        if (!userResponse.data.courses?.length) {
          throw new Error('No courses found');
        }

        const courseId = userResponse.data.courses[0]._id;
        setUserData(courseId);

        // Fetch chat messages for the course
        const messagesResponse = await client.get(`api/chat/${courseId}`);
        console.log("messagesResponse",messagesResponse.data);
        const formattedMessages = messagesResponse.data.chats.map(msg => ({
          id: msg._id,
          text: msg.content,
          timestamp: new Date(msg.chatDate || msg.createdAt).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          avatar: msg.senderID.Profile_Picture,
          isSentByMe: msg.senderID._id === user.id
        }));
        setMessages(formattedMessages);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message || 'An error occurred while loading the chat');
        setLoading(false);
      }
    };

    fetchData();

    // Listen for new messages
    socket.on('newChat', (newMessage) => {
      const formattedMessage = {
        id: newMessage._id,
        text: newMessage.content,
        timestamp: new Date(newMessage.chatDate || newMessage.createdAt).toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        avatar: "/placeholder.svg",
        isSentByMe: newMessage.senderID === user.id
      };
      setMessages(prevMessages => [...prevMessages, formattedMessage]);
    });

    return () => {
      socket.off('newChat');
    };
  }, [socket, user?.id]);

  const onSubmit = async (data) => {
    if (!socket || !userData || !data.message.trim()) return;

    try {
      const messageData = {
        senderID: user.id,
        courseID: userData,
        content: data.message,
        chatDate: new Date()
      };

      const response = await client.post('api/chat', messageData);
      reset();
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
    }
  };

  if (loading) {
    return (
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <Typography>Loading...</Typography>
        </Box>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Box sx={{ p: 3 }}>
          <Typography color="error">Error: {error}</Typography>
        </Box>
      </Layout>
    );
  }

  if (!userData) {
    return (
      <Layout>
        <Box sx={{ p: 3 }}>
          <Typography>No course data available</Typography>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Grid container sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h4" sx={{ p: 3 }}>Group Chat</Typography>
        
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

