const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    namaCourse: { type: String, required: true ,unique:true},
    Deskripsi: { type: String },
    mentorID: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Mentor' }
    ],
    daftarKelas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AnakMagang' }],
}, {
    collection: 'Course',
    timestamps: true
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
