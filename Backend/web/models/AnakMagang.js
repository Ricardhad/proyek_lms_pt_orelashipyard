const mongoose = require('mongoose');

const anakMagangSchema = new mongoose.Schema({
  AsalSekolah: { type: String, required: true }, 
  courseID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Course' }, 
  userID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'userData' }, 
});

const anakMagang = mongoose.model('AnakMagang', anakMagangSchema);

module.exports = anakMagang;
