const mongoose = require('mongoose')

// Terdapat 2 Schema pada model ini, hal ini disebabkan oleh adanya document di dalam document
// DetailSchema perlu dibuat lalu akan dipanggil kembali pada schema transaction
const TransactionDetailSchema = mongoose.Schema({
    item: String,
    qty: Number
});

/**
 * Untuk melakukan reference, kita akan menyimpan ObjectId yang merupakan value dari field _id
 * Untuk melakukan reference, cukup berikan atribut 'ref' yang mengarah ke model yang dituju.
 * 
 * Untuk document di dalam document, cukup masukkan schema yang sudah dibuat pada type dari sebuah field.
 */
const TransactionSchema = mongoose.Schema({
    customer_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
    },
    stand_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Stand'
    },
    items_bought:{
        type: [TransactionDetailSchema]
    },
    total:{
        type: Number
    },
});

const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports= Transaction;