const mongoose = require('mongoose');

const mentorSchema = new mongoose.Schema({
  Jabatan: { type: String, required: true },
  courseID: [
    { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Course' }
  ],
  userID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'UserData' },
}, {
  collection: 'Mentor',
  timestamps: true
});

const Mentor = mongoose.model('Mentor', mentorSchema);

module.exports = Mentor;
