const mongoose = require('mongoose');

const modulSchema = new mongoose.Schema({
    courseID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Course' },
    mentorID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Mentor' },
    gambar: { type: String }, // New field to store image path
    namaModul: { type: String, required: true },
    Deskripsi: { type: String },
    Deadline: { type: Date },
    soalID: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SoalModul' }],
    absensiID:{ type: mongoose.Schema.Types.ObjectId, ref: 'Absensi' },
    Dinilai: { type: Boolean },
}, {
    collection: 'Modul',
    timestamps: true
});

const Modul = mongoose.model('Modul', modulSchema);

module.exports = Modul;