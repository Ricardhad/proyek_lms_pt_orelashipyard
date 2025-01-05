const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    senderID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'UserData' },
    courseID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Course' },
    content: {
        type: String,
        required: true
    },
    attachments: [{
        fileUrl: String,
        fileType: String,
        fileName: String
    }],
    chatDate: { type: Date, required: false },
    content: { type: String, required: true },
}, {
    collection: 'Chat',
    timestamps: true
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
