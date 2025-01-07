const express = require('express');
const mongoose = require('mongoose');
const api = require('./routes/index');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  }
});

const port = 3000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST','PUT','DELETE'],
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', api);

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('newChat', (data) => {
    console.log('New message:', data);
    io.emit('newChat', data); // Broadcast the message to all clients
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/projectFPW')
  .then(() => {
    console.log('Database connected');
  })
  .catch((e) => {
    console.log('Error database connection: ', e);
  });

// Start the server
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Error handling for unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});




// const express = require('express');
// const mongoose = require('mongoose');
// const api = require('./routes/index');
// const app = express();
// const port = 3000;
// const cors = require('cors');
// app.use(express.json());
// const http = require('http');
// const socketIo = require('socket.io');
// const { router, initSocketIO } = require('./routes/Chat.route'); // Adjust the path
// app.use(cors());

// app.use(express.urlencoded({ extended: true }));

// app.use('/api', api);
// app.get('/', (req, res) => res.send('Hello World!'));;

// app.listen(port, async () => {
//     try {
//         await mongoose.connect('mongodb://localhost:27017/projectFPW');
//         console.log('Database connected');
//     } catch (e) {
//         console.log('Error database connection \n', e);
//     }
//     console.log(`listening on port ${port}!`);
// });