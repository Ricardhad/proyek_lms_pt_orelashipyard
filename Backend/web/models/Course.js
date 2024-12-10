const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    namaCourse: { type: String, required: true },
    mentorID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Mentor' },
    daftarKelas: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'anakMagang' }],
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
