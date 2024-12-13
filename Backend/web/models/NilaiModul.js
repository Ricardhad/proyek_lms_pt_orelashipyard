const mongoose = require('mongoose');

const nilaiModulSchema = new mongoose.Schema({
    courseID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Course' }, 
    modulID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Modul' }, 
    mentorID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Mentor' }, 
    anakMagangID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'AnakMagang' }, 
    catatan: { type: string, default:null }, 
    nilai: { type: Number, default: 0 }, 

});

const NilaiModul = mongoose.model('NilaiModul', nilaiModulSchema);

module.exports = NilaiModul;
