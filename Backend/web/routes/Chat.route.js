const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat'); // Import the Chat model
const mongoose = require('mongoose');
const { isValidObjectId } = require('mongoose'); // For validating ObjectIds

// Route to fetch chat messages for a specific course
router.get('/:courseID', async (req, res) => {
    try {
        const { courseID } = req.params;

        // Validate if courseID is a valid ObjectId
        if (!isValidObjectId(courseID)) {
            return res.status(400).json({ error: 'Invalid courseID' });
        }

        // Find all chat messages for the course, populate senderID and courseID, and sort by chatDate
        const chats = await Chat.find({courseID})
            .populate('senderID', 'namaUser Profile_Picture') // Populate sender's name from UserData
            .populate('courseID', 'namaCourse') // Populate course name from Course
            .sort({ chatDate: 1 }); // Sort by chatDate in ascending order

        // Return the chats as a JSON response
        res.status(200).json({ chats });
    } catch (error) {
        console.error('Error fetching chats:', error);
        res.status(500).json({ error: 'Error fetching chats' });
    }
});

// Route to send a new chat message
router.post('/', async (req, res) => {
    try {
      const { senderID, courseID, content, attachments } = req.body;
      console.log('Received request body:', req.body);
  
      // Validate if senderID and courseID are valid ObjectIds
      if (!isValidObjectId(senderID) || !isValidObjectId(courseID)) {
        return res.status(400).json({ error: 'Invalid senderID or courseID' });
      }
  
      // Create a new chat message
      const newChat = new Chat({
        senderID,
        courseID,
        content,
        attachments,
        chatDate: new Date(), // Set the current date and time
      });
      console.log('New chat message:', newChat);
  
      // Save the new chat message to the database
      await newChat.save();
  
      // Access the io instance from the app
      const io = req.app.get('io');
      console.log('WebSocket io instance:', io); // Debug log
  
      if (!io) {
        throw new Error('WebSocket io instance is not available');
      }
  
      // Emit the new message to all connected clients (via WebSocket)
      io.emit('newChat', newChat); // Broadcast the new chat message to all clients
  
      // Return a success response with the new chat message
      res.status(201).json({ message: 'Chat created successfully', newChat });
    } catch (error) {
      console.error('Error sending chat message:', error);
      res.status(500).json({ error: 'Error sending chat message' });
    }
  });

// Route to send a new chat message
// router.post('/', async (req, res) => {
//     try {
//         const { senderID, courseID, content, attachments } = req.body;
//         console.log('Received request body:', req.body);
//         // Validate if senderID and courseID are valid ObjectIds
//         if (!isValidObjectId(senderID) || !isValidObjectId(courseID)) {
//             return res.status(400).json({ error: 'Invalid senderID or courseID' });
//         }

//         // Create a new chat message
//         const newChat = new Chat({
//             senderID,
//             courseID,
//             content,
//             attachments,
//             chatDate: new Date(), // Set the current date and time
//         });
//         console.log('New chat message:', newChat);
//         // Save the new chat message to the database
//         await newChat.save();

//         // Emit the new message to all connected clients (via WebSocket)
//         const io = req.app.get('io'); // Access the io instance from the app
//         io.emit('newChat', newChat); // Broadcast the new chat message to all clients

//         // Return a success response with the new chat message
//         res.status(201).json({ message: 'Chat created successfully', newChat });
//     } catch (error) {
//         console.error('Error sending chat message:', error);
//         res.status(500).json({ error: 'Error sending chat message' });
//     }
// });

module.exports = router;