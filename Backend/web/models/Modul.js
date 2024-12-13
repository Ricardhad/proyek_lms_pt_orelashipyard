const mongoose = require('mongoose');

const modulSchema = new mongoose.Schema({
    courseID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Course' }, 
    namaModul: { type: String, required: true }, 
    Deskripsi: { type: String }, 
    Deadline: { type: Date, required: true }, 
    soalID: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SoalModul' }],
    Dinilai: { type: Boolean }, 
});

const Modul = mongoose.model('Modul', modulSchema);

module.exports = Modul;
