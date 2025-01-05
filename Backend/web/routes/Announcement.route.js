const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Announcement = require('../models/Announcement');


// Multer configuration for PDF storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/announcements';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Create new announcement with optional PDF attachment
router.post('/createannouncement', upload.array('attachments', 5), async (req, res) => {
  try {
    const { title, description ,userID} = req.body;
    const files = req.files;

    const attachments = files ? files.map(file => ({
      fileName: file.originalname,
      filePath: file.path,
      fileType: file.mimetype,
      fileSize: file.size,
      uploadDate: new Date()
    })) : [];

    const announcement = new Announcement({
      title,
      description,
      createdBy: userID, // Assuming you have user authentication middleware
      attachments
    });

    await announcement.save();
    res.status(201).json({ success: true, data: announcement });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get all announcements
router.get('/allAnnouncement', async (req, res) => {
  try {
    // Extract the title query parameter
    const { title } = req.query;

    // Create a filter object
    let filter = {};
    if (title) {
      filter.title = { $regex: title, $options: 'i' }; // Case-insensitive search
    }

    const announcements = await Announcement.find(filter)
      .populate('createdBy', 'namaUser email roleType')
      .sort({ date: -1 });

    res.json({ success: true, data: announcements });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get single announcement by ID
router.get('/:id/singleAnnouncement', async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id)
      .populate('createdBy', 'namaUser email roleType')
    
    if (!announcement) {
      return res.status(404).json({ success: false, error: 'Announcement not found' });
    }
    
    res.json({ success: true, data: announcement });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update announcement
router.put('/:id/editAnnouncement', upload.array('attachments', 5), async (req, res) => {
  try {
    const { title, description } = req.body;
    const files = req.files;

    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ success: false, error: 'Announcement not found' });
    }

    // Delete old files if new files are uploaded
    if (files && files.length > 0 && announcement.attachments.length > 0) {
      announcement.attachments.forEach(attachment => {
        if (fs.existsSync(attachment.filePath)) {
          fs.unlinkSync(attachment.filePath);
        }
      });
    }

    const attachments = files ? files.map(file => ({
      fileName: file.originalname,
      filePath: file.path,
      fileType: file.mimetype,
      fileSize: file.size,
      uploadDate: new Date()
    })) : announcement.attachments;

    const updatedAnnouncement = await Announcement.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        attachments
      },
      { new: true }
    );

    res.json({ success: true, data: updatedAnnouncement });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Delete announcement
router.delete('/:id/deleteAnnouncement', async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ success: false, error: 'Announcement not found' });
    }

    // Delete associated files
    announcement.attachments.forEach(attachment => {
      if (fs.existsSync(attachment.filePath)) {
        fs.unlinkSync(attachment.filePath);
      }
    });

    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Announcement deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Download PDF attachment
router.get('/download/:id/:attachmentId', async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ success: false, error: 'Announcement not found' });
    }

    const attachment = announcement.attachments.id(req.params.attachmentId);
    if (!attachment) {
      return res.status(404).json({ success: false, error: 'Attachment not found' });
    }

    if (!fs.existsSync(attachment.filePath)) {
      return res.status(404).json({ success: false, error: 'File not found' });
    }

    res.download(attachment.filePath, attachment.fileName);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;