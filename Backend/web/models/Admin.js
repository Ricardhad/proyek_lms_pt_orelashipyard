const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Judul pengumuman
  description: { type: String, required: true }, // Isi pengumuman
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'userData', required: true }, // ID pengguna yang membuat
  date: { type: Date, default: Date.now }, // Tanggal pengumuman dibuat
});

const adminSchema = new mongoose.Schema(
  {
    userID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'userData' },

    calenderPicture: {
      fileName: { type: String, default: null },
      filePath: { type: String, default: null },
      fileType: { type: String, default: null },
      uploadDate: { type: Date, default: null },
    },

    announcements: [announcementSchema,announcementSchema], // Array dari pengumuman
  },
  {
    collection: 'Admin',
    timestamps: true,
  }
);

const Admin = mongoose.model('Admin', adminSchema,);

module.exports = Admin;
