const mongoose = require('mongoose')

/**
 * Schema untuk model User dengan validasi yang lebih lengkap
 */
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Nama obat harus diisi'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Deskripsi obat harus diisi'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Harga obat harus diisi'],
        min: [1, 'Harga tidak boleh kurang dari 1'],
        validate: {
            validator: function(v) {
                return v > 0;
            },
            message: 'Harga harus lebih dari 0'
        }
    },
    stok: {
        type: Number,
        required: [true, 'Stok obat harus diisi'],
        min: [1, 'Stok minimal harus 1'],
        validate: {
            validator: function(v) {
                return Number.isInteger(v);
            },
            message: 'Stok harus berupa bilangan bulat'
        }
    },
    status: {
        type: String,
        required: [true, 'Status obat harus diisi'],
        enum: {
            values: ['tersedia', 'tidak tersedia'],
            message: 'Status hanya bisa tersedia atau tidak tersedia'
        },
        default: 'tersedia'
    },
    isBanned: {
        type: Boolean,
        default: false
    },
    bannedReason: {
        type: String,
        default: null
    }
}, {
    timestamps: true // Menambahkan createdAt dan updatedAt
});

// Menambahkan method untuk mengecek ketersediaan stok
UserSchema.methods.isAvailable = function() {
    return this.stok > 0 && this.status === 'tersedia';
};

// Middleware untuk mengupdate status berdasarkan stok
UserSchema.pre('save', function(next) {
    if (this.stok < 1) {
        this.status = 'tidak tersedia';
    }
    next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User; 