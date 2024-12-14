const mongoose = require('mongoose');

const soalModulSchema = new mongoose.Schema({
    namaSoal: { type: String, required: true },
    Deskripsi: { type: String },
    Gambar: { type: String, required: true },
    SoalType: { type: Number, required: true },
    Pilihan: [{ type: String, required: true }],
    kunciJawaban: { type: Number, required: true },
}, {
    collection: 'SoalModul',
    timestamps: true
});

const SoalModul = mongoose.model('SoalModul', soalModulSchema);

module.exports = SoalModul;
