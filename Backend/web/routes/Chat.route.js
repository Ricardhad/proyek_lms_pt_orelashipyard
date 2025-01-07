const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat'); // Import the Chat model
const mongoose = require('mongoose');
const { io } = require('../index'); // Import socket.io instance from index.js

// Route to fetch chat messages for a specific course
router.get('/:courseID', async (req, res) => {
    try {
        const { courseID } = req.params;
        // Find all chat messages for the course
        const chats = await Chat.find({ courseID: mongoose.Types.ObjectId(courseID) }).populate('senderID', 'name').populate('courseID', 'courseName').sort({ chatDate: 1 });
        res.status(200).json({ chats });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching chats' });
    }
});

// Route to send a new chat message
router.post('/', async (req, res) => {
    try {
        const { senderID, courseID, content, attachments } = req.body;

        const newChat = new Chat({
            senderID: mongoose.Types.ObjectId(senderID),
            courseID: mongoose.Types.ObjectId(courseID),
            content,
            attachments,
            chatDate: new Date(),
        });

        await newChat.save();

        // Emit the new message to all connected clients (via WebSocket)
        io.emit('newChat', newChat); // Broadcasting the new chat message to all clients

        res.status(201).json({ message: 'Chat created successfully', newChat });
    } catch (error) {
        res.status(500).json({ error: 'Error sending chat message' });
    }
});

module.exports = router;
