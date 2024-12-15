import React, { useState } from 'react';
import MainLayout from '../main-layout';
import {
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';

const initialMessages = [
  { id: 1, sender: 'John Doe', content: 'Hi everyone! How\'s the internship going?', timestamp: '09:30 AM' },
  { id: 2, sender: 'Jane Smith', content: 'It\'s great! I\'m learning so much.', timestamp: '09:32 AM' },
  { id: 3, sender: 'Alice Johnson', content: 'Same here. The mentors are really helpful.', timestamp: '09:35 AM' },
];

export default function GroupChat() {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() !== '') {
      const message = {
        id: messages.length + 1,
        sender: 'You',
        content: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  return (
    <MainLayout>
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Group Chat
      </Typography>
      <Card sx={{ height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flexGrow: 1, overflow: 'auto' }}>
          <List>
            {messages.map((message) => (
              <ListItem key={message.id} alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar alt={message.sender} src="/placeholder.svg" />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography component="span" variant="body1" color="text.primary">
                      {message.sender}
                    </Typography>
                  }
                  secondary={
                    <React.Fragment>
                      <Typography component="span" variant="body2" color="text.primary">
                        {message.content}
                      </Typography>
                      <Typography component="span" variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        {message.timestamp}
                      </Typography>
                    </React.Fragment>
                  }
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
        <Paper sx={{ p: 2 }}>
          <Box component="form" onSubmit={handleSendMessage} sx={{ display: 'flex' }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              sx={{ mr: 1 }}
            />
            <Button type="submit" variant="contained" endIcon={<SendIcon />}>
              Send
            </Button>
          </Box>
        </Paper>
      </Card>
    </Box>
    </MainLayout>
  );
}

