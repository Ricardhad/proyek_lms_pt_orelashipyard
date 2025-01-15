const mongoose = require('mongoose');

const jawabanModulSchema = new mongoose.Schema({
    courseID: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        ref: 'Course' // Reference to the 'Course' collection
    },
    modulID: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        ref: 'Modul' 
    },
    anakMagangID: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        ref: 'AnakMagang' 
    },
    soalModulID: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        ref: 'SoalModul' 
    },
    jawaban: { 
        type: String, 
        default: null,
        validate: {
            validator: function (value) {
                // Validate if jawabanType is 1 (essay), then jawaban must be provided
                return this.jawabanType === 1 ? value && value.trim() !== '' : true;
            },
            message: 'Essay answers must include a jawaban.',
        },
    },
    jawabanType: { 
        type: Number, 
        required: true,
        enum: [0, 1, 2], // 0 = multiple-choice, 1 = essay, 2 = file
    },
    uploadJawaban: {
        fileName: { 
            type: String, 
            required: function() { return this.jawabanType === 2; },
        },
        filePath: { 
            type: String, 
            required: function() { return this.jawabanType === 2; },
        },
        fileType: { 
            type: String, 
            required: function() { return this.jawabanType === 2; },
        },
        uploadDate: { 
            type: Date, 
            required: function() { return this.jawabanType === 2; },
        },
    },
}, {
    collection: 'JawabanModul',
    timestamps: true,
});

const JawabanModul = mongoose.model('JawabanModul', jawabanModulSchema);

module.exports = JawabanModul;
