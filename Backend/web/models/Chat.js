const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    mentorID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Mentor' }, 
    anakMagangID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'anakMagang' }, 
    chatDate: { type: Date, required: true }, 
    content: { type: String,required:true },
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
