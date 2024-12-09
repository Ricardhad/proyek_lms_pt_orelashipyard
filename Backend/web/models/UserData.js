const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  namaUser: { type: String, required: true },
  Profile_Picture: { type: String, default: null },
  roleType: { type: Number, required: true }, 
  noTelpon: { type: String, required: true }, 
  email: { type: String, required: true, unique: true }, 
  password: { type: String, required: true }, 
}, { timestamps: true }); 
const User = mongoose.model('UserData', userSchema);

module.exports = User;
