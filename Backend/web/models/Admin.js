const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'userData' },
}, {
  collection: 'Admin',
  timestamps: true
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
