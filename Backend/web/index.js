// index.js (Backend)
const express = require('express');
const mongoose = require('mongoose');
const api = require('./routes/index');
const app = express();
const port = 3000;
const cors = require('cors');
app.use(express.json());
const http = require('http');
const socketIo = require('socket.io');
const Chat = require('./models/Chat');
app.use(cors());

app.use(express.urlencoded({ extended: true }));

app.use('/api', api);
app.get('/', (req, res) => res.send('Hello World!'));
const server = http.createServer(app);
const io = socketIo(server);

// Socket.IO connection
io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('sendMessage', async (message) => {
        try {
            // Optionally, you can validate the message here
            const newChat = new Chat({
                senderID: message.senderID,
                courseID: message.courseID,
                content: message.content,
                attachments: message.attachments || [], // Handle attachments if any
                chatDate: new Date() // Set the chat date to now
            });

            // Save the message to the database
            await newChat.save();

            // Emit the message to all connected clients
            io.emit('receiveMessage', newChat);
        } catch (error) {
            console.error('Error saving message:', error);
            // Optionally, emit an error event back to the client if necessary
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

app.listen(port, async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/projectFPW');
        console.log('Database connected');
    } catch (e) {
        console.log('Error database connection \n', e);
    }
    console.log(`listening on port ${port}!`);
});
