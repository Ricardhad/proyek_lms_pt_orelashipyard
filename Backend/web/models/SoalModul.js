const mongoose = require('mongoose');

const soalModulSchema = new mongoose.Schema({
    Soal: { type: String},
    // Deskripsi: { type: String },
    // Gambar: { type: String },
    Gambar: {
        fileName: { type: String, default: null },
        filePath: { type: String, default: null },
        fileType: { type: String, default: null },
        uploadDate: { type: Date, default: null },
    },
    SoalType: { type: Number, required: true, 
        enum: [0, 1, 2],
    },//soaltype 0 untuk pilgan 1 untuk essay 2 untuk file
    Pilihan: [{ type: String }],
    kunciJawaban: { type: Number },
    nilai: { type: Number },
}, {
    collection: 'SoalModul',
    timestamps: true
});

const SoalModul = mongoose.model('SoalModul', soalModulSchema);

module.exports = SoalModul;
