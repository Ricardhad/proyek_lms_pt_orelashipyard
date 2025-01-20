const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const socketIo = require('socket.io');
const api = require('./routes/index'); // Import your API routes
require('dotenv').config();
const DBURL = process.env.MONGODB_URI;
const app = express();
const allowedOrigins = process.env.CORS_ORIGIN;
const port = 3000;

// CORS Configuration
const corsOptions = {
  origin: 'https://proyek-lms-pt-orelashipyard-henna.vercel.app', // Your frontend's origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  credentials: true, // If you use cookies or Authorization headers
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight requests

// Attach Socket.IO to Express App
const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

const io = socketIo(server, { cors: corsOptions });
app.set('io', io);

app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// Simple route to test server
// app.use("/", (req, res) => {
//   res.send("server is running");
// });
app.get('/api/test', (req, res) => {
  res.json({ message: "Test route" });
});
// Mount API Routes
app.use('/api', api);

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

// MongoDB connection
mongoose
  .connect(DBURL, {})
  .then(() => {
    console.log('Database connected');
  })
  .catch((e) => {
    console.error('Error connecting to the database:', e);
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
