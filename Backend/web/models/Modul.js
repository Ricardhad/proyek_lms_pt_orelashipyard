const mongoose = require('mongoose');

const modulSchema = new mongoose.Schema({
    courseID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'userData' }, 
    namaModul: { type: String, required: true }, 
    Deadline: { type: Date, required: true }, 
    soalID: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Soal' }],
    Dinilai: { type: Boolean }, 
});

const Modul = mongoose.model('Modul', modulSchema);

module.exports = Modul;
