const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const socketIo = require('socket.io');
const api = require('./routes'); // Import your API routes (no need for .index.js)
require('dotenv').config();

const DBURL = process.env.MONGODB_URI;
const app = express();

const corsOptions = {
  origin: 'https://proyek-lms-pt-orelashipyard-henna.vercel.app', // Your frontend's origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  credentials: true, // If you use cookies or Authorization headers
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight requests

app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// Simple route to test server
app.get('/api/test', (req, res) => {
  res.json({ message: "Test route" });
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});

app.get('/api/db', (req, res) => {
  mongoose.connection.db.admin().ping((err, result) => {
    if (err) {
      // Log the detailed error for debugging
      console.error('Database connection error:', err);
      // Send response indicating failure
      return res.status(500).json({
        message: 'Failed to connect to the database',
        error: err.message // Include the error message in the response
      });
    }
    // Log successful connection
    console.log('MongoDB connection successful:', result);
    // Send response indicating success
    res.status(200).json({
      message: 'Database connected successfully'
    });
  });
});

// Mount API Routes
app.use('/api', api); // Now correctly points to routes/index.js

// MongoDB connection
mongoose.connect(DBURL,{
  serverSelectionTimeoutMS: 5000, 
  socketTimeoutMS: 45000,
})
  .then(() => {
    console.log('Database connected');
  })
  .catch((e) => {
    console.error('Error connecting to the database:', e);
  });

// Socket.IO connection handler (optional)
const server = require('http').Server(app);
const io = socketIo(server, { cors: corsOptions });
app.set('io', io);

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

// Export the serverless function (for Vercel)
module.exports = app;
