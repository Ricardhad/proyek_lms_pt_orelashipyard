const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'userData' },
  calenderPicture: {
    fileName: { type: String, default: null },
    filePath: { type: String, default: null },
    fileType: { type: String, default: null },
    uploadDate: { type: Date, default: null },
},
}, {
  collection: 'Admin',
  timestamps: true
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
