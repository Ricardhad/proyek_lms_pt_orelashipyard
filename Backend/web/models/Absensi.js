const mongoose = require('mongoose');

const absensiSchema = new mongoose.Schema({
    courseID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Course' },
    modulID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Modul' },
    absensiKelas: [
      {
        anakMagangID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'AnakMagang' },
        isPresent: { type: Boolean, required: true },
      },
    ],
  }, {
    collection: 'Absensi',
    timestamps: true,
  });

const Absensi = mongoose.model('Absensi', absensiSchema);

module.exports = Absensi;