const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  namaUser: { type: String, required: true },
  Profile_Picture: { type: String, default: null },
  roleType: { type: Number, required: true }, 
  noTelpon: { type: String, required: true }, 
  email: { type: String, required: true, unique: true }, 
  password: { type: String, required: true }, 
  isVerified:{ type:Boolean,default: false },
}); 
const UserData = mongoose.model('userData', userSchema);

// untuk save data dummy
// const dummyUser = new UserData({
//     namaUser: 'Test User',
//     Profile_Picture: 'http://example.com/pic.jpg',
//     roleType: 1,
//     noTelpon: '1234567890',
//     email: 'test@example.com',
//     password: 'testpassword'
//   });
  
//   dummyUser.save().then(() => {
//     console.log('Dummy user saved');
//   }).catch(console.error);

module.exports = UserData;
