const mongoose = require('mongoose');

const UserDataSchema = new mongoose.Schema({
  namaUser: { type: String, required: true },
  Profile_Picture: { type: String, default: '' },
  roleType: { type: Number, required: true },
  noTelpon: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
}, {
  collection: 'UserData',
  timestamps: true
});

module.exports = mongoose.model('UserData', UserDataSchema);

// untuk save data dummy




