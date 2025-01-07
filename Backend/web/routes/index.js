
const userDataRouter = require('./userData.route')
const adminRouter = require('./Admin.route')
const anakMagangRouter = require('./anakMagang.route')
const mentorRouter = require('./Mentor.route')
const modulRouter = require('./Modul.route')
const announcementRouter = require('./Announcement.route')
const chatRouter = require('./Chat.route')
const express = require('express')
const { upload } = require('./Middleware')
const router = express()
const path = require("path");
const fs = require("fs");



router.use('/user', userDataRouter)
router.use('/admin', adminRouter)
router.use('/anakMagang', anakMagangRouter)
router.use('/mentor', mentorRouter)
router.use('/modul', modulRouter)
router.use('/announcement', announcementRouter)
router.use('/chat', chatRouter); 
router.post('/upload', upload.single('uploadSoal'), (req, res) => {
   console.log(req.file)
    const Gambar = req.file //sesuain key nya sama fieldname diatas(uploadSoal bukan Gambar);
    ? {
        fileName: req.file.filename,
        filePath: req.file.path,
        fileType: req.file.mimetype,
        uploadDate: new Date(),
    }
    : null;
    console.log('File uploaded:', Gambar);
    res.send('File uploaded successfully');
});

module.exports= router;