const mongoose = require('mongoose');

const absensiSchema = new mongoose.Schema({
    courseID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Course' },
    tanggalAbsensi: { type: Date, required: true },
    absensiKelas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserData' }],
}, {
    collection: 'Absensi',
    timestamps: true
});

const Absensi = mongoose.model('Absensi', absensiSchema);

module.exports = Absensi;
