const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'userData' }, 
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
