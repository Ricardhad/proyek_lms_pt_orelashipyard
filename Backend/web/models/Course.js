const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    namaCourse: { type: String, required: true },
    Deskripsi: { type: String },
    mentorID: [
        { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Mentor' }
    ],
    daftarKelas: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'anakMagang' }],
}, {
    collection: 'Course',
    timestamps: true
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
