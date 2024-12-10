const mongoose = require('mongoose');

const soalModulSchema = new mongoose.Schema({
    namaSoal: { type: String, required: true }, 
    Gambar: { type: String, required: true }, 
    SoalType: { type: Number, required: true }, 
    Pilihan: [{ type: String,required: true }],
    kunciJawaban: { type: Number, required:true }, 
});

const SoalModul = mongoose.model('SoalModul', soalModulSchema);

module.exports = SoalModul;
