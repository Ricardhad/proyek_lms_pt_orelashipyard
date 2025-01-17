const mongoose = require('mongoose');

const UserDataSchema = new mongoose.Schema({
  namaUser: { type: String, required: true },
  Profile_Picture: { type: String, default: '' },
  roleType: { type: Number, required: true ,min:0,max:2},// 2 anakmagang 1 mentor 0 admin
  noTelpon: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
}, {
  collection: 'UserData',
  timestamps: true
});

const UserData = mongoose.model('UserData', UserDataSchema);

module.exports = UserData;
