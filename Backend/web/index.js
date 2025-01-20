// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const api = require('./routes/index'); // Import your API routes
 require('dotenv').config();
const DBURL = process.env.MONGODB_URI
const app = express();
const server = http.createServer(app);
const allowedOrigins = process.env.CORS_ORIGIN;
const port = 3000;

// console.log(allowedOrigins[0])
const corsOptions = {
  origin: (origin, callback) => {
    if (origin === undefined || allowedOrigins.includes(origin)) {
      callback(null, true);  // Allow the request if there's no origin or it's in the allowed list
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin'],
};

app.use(cors(corsOptions));

// Konfigurasi Socket.IO dengan CORS yang sama
const io = socketIo(server, { cors: corsOptions });
app.set('io', io);
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies
app.use("/",(req,res)=>{
  res.send("server is running")
}); // Parse URL-encoded request bodies

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
  .connect(DBURL, {
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