// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const api = require('./routes/index'); // Import your API routes
require('dotenv').config();

// Initialize Express app and HTTP server
const app = express();
const server = http.createServer(app);

const port = 3000;
const corsOptions = {
  origin: 'http://localhost:5173', // Allow frontend origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers, tambahkan Authorization
};
app.use(cors(corsOptions));

// Konfigurasi Socket.IO dengan CORS yang sama
const io = socketIo(server, { cors: corsOptions });
app.set('io', io);
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// Routes
app.use('/api', api); // Mount the API routes

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('newChat', (data) => {
    console.log('New message:', data);
    io.emit('newChat', data); // Broadcast the message to all connected clients
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

mongoose
  .connect('mongodb://localhost:27017/projectFPW', {
  })
  .then(() => {
    console.log('Database connected');
  })
  .catch((e) => {
    console.error('Error connecting to the database:', e);
  });

// Start the server
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Error handling for unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});

// Error handling for uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1); // Exit the process to avoid undefined behavior
});