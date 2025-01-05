const express = require('express')
const router = express()

const {
    Course, Mentor, Admin, UserData, AnakMagang,
    Modul, JawabanModul, SoalModul, NilaiModul,Absensi,
    validateArrayOfIDs,
    checkIdValid,
    checkIdExist,
    validateArrayOfIDsCheckRole
} = require("./functions");

const Joi = require('joi');
const mongoose = require('mongoose');
const { upload } = require('./Middleware');


const mongoose = require('mongoose');

// Route to get all chats by courseID
router.get('/chats/:courseID', async (req, res) => {
    const { courseID } = req.params;

    try {
        const chats = await Chat.find({ courseID }).populate('senderID', 'name') // Populating senderID to get user details
            .populate('courseID', 'title'); // Populating courseID to get course details
        res.status(200).json(chats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving chats' });
    }
});

// Route to create a new chat
router.post('/chats', async (req, res) => {
    const { senderID, courseID, content, attachments } = req.body;

    try {
        const newChat = new Chat({
            senderID,
            courseID,
            content,
            attachments,
            chatDate: new Date() // Optional: Set current date
        });

        await newChat.save();
        res.status(201).json(newChat);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating chat' });
    }
});

module.exports = router;
