const mongoose = require('mongoose');

const mentorSchema = new mongoose.Schema({
  Jabatan: { type: String, required: true }, 
  userID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'userData' }, 
});

const Mentor = mongoose.model('Mentor', mentorSchema);

module.exports = Mentor;
