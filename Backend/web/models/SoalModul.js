const mongoose = require('mongoose');

const soalModulSchema = new mongoose.Schema({
    namaSoal: { type: String, required: true },
    Deskripsi: { type: String },
    Gambar: { type: String },
    SoalType: { type: Number, required: true, 
        min: 0, 
        max: 1 },
    Pilihan: [{ type: String }],
    kunciJawaban: { type: Number },
}, {
    collection: 'SoalModul',
    timestamps: true
});

const SoalModul = mongoose.model('SoalModul', soalModulSchema);

module.exports = SoalModul;
