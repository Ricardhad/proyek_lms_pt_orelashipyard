const mongoose = require('mongoose');

const jawabanModulSchema = new mongoose.Schema({
    courseID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Modul' },
    anakMagangID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'AnakMagang' },
    soalModulID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'SoalModul' },
    jawaban: { 
        type: String, 
        default: null,
        validate: {
            validator: function (value) {
                // Validate if jawabanType is 'essay', then jawaban must be provided
                return this.jawabanType === 'essay' ? value && value.trim() !== '' : true;
            },
            message: 'Essay answers must include a jawaban.',
        },
    },
    jawabanType: { 
        type: String, 
        required: true,
        enum: ['essay', 'file'],  // Only allow 'essay' or 'file' as types
    },
    uploadJawaban: {
        fileName: { 
            type: String, 
            required: function() { return this.jawabanType === 'file'; },  // Only required if jawabanType is 'file'
        },
        filePath: { 
            type: String, 
            required: function() { return this.jawabanType === 'file'; },
        },
        fileType: { 
            type: String, 
            required: function() { return this.jawabanType === 'file'; },
        },
        uploadDate: { 
            type: Date, 
            required: function() { return this.jawabanType === 'file'; },
        },
    },
}, {
    collection: 'JawabanModul',
    timestamps: true,
});

const JawabanModul = mongoose.model('JawabanModul', jawabanModulSchema);

module.exports = JawabanModul;
