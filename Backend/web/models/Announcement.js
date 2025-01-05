const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'UserData', 
    required: true 
  },
  date: { 
    type: Date, 
    default: Date.now 
  },
  attachments: [{
    fileName: { 
      type: String,
      default: null 
    },
    filePath: { 
      type: String,
      default: null 
    },
    fileType: { 
      type: String,
      default: null 
    },
    fileSize: { 
      type: Number,
      default: null 
    },
    uploadDate: { 
      type: Date,
      default: Date.now 
    }
  }]
}, {
  collection: 'Announcement',
  timestamps: true
});

const Announcement = mongoose.model('Announcement', announcementSchema);

module.exports = Announcement;