const mongoose = require('mongoose')

// Untuk melakukan definisi item yang bersifat array, cukup berikan []
const StandSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    items: {
        type: [String]
    },
});

const Stand = mongoose.model('Stand', StandSchema);

module.exports= Stand;