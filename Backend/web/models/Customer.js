const mongoose = require('mongoose')

/**
 * Untuk membuat model mongoose, perlu dilakukan pembuatan schema terlebih dahulu menggunakan mongoose.Schema
 * Pembuatan Schema dilakukan agar data yang disimpan lebih konsisten.
 * Schema akan berisi field dan tipe datanya.
 * Kita dapat memberikan beberapa pengecekan seperti min, max, required, dan lain-lain untuk validasi data
 */
const CustomerSchema = new mongoose.Schema({
    name: String,
    age: {
        type: Number,
        min: [10, 'umur anda masih {VALUE}, minimal 10 tahun']
    },
    email: {
        type: String,
        required: true
    },
});

/** 
 * Setelah membuat schema, model akan dibuat dengan mongoose.model.
 * Parameter yang diterima adalah nama model yang dibuat dan schema yang diinginkan
 * mongoose akan secara otomatis mencari collection dengan nama yang diberikan di model
 * tetapi dalam lowercase dan dalam plural. 
 * Pada contoh "Customer", mongoose akan mencari collection bernama "customers".
 */
const Customer = mongoose.model('Customer', CustomerSchema);

module.exports= Customer;