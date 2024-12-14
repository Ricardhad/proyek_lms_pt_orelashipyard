const mongoose = require('mongoose');

const jawabanModulSchema = new mongoose.Schema({
    courseID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Modul' },
    anakMagangID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'AnakMagang' },
    soalModulID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'SoalModul' },
    jawaban: { type: String, default: null },
    jawabanType: { type: Number, default: 0 },
    uploadJawaban: {
        fileName: { type: String, required: true }, // Uploaded file name
        filePath: { type: String, required: true }, // Path to the uploaded file
        fileType: { type: String, required: true }, // MIME type of the file
        uploadDate: { type: Date, required: true }, // Date when the file was uploaded
    },
}, {
    collection: 'JawabanModul',
    timestamps: true
});


const JawabanModul = mongoose.model('JawabanModul', jawabanModulSchema);

module.exports = JawabanModul;
