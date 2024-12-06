const express = require('express')
const router = express()
const Drugs = require('../models/Drugs')

// Create - Menambah obat baru
router.post('/', async (req, res) => {
    try {
        const { name, description, price, stok } = req.body;

        // Validasi harga dan stok
        if (price <= 0) {
            return res.status(400).json({ message: 'Harga tidak boleh 0 atau kurang dari 0' });
        }

        if (stok < 1) {
            return res.status(400).json({ message: 'Stok minimal harus 1' });
        }

        const drug = new Drugs({
            name,
            description,
            price,
            stok,
            status: 'tersedia',
            isBanned: false,
            bannedReason: null
        });

        const savedDrug = await drug.save();
        res.status(201).json(savedDrug);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Read - Mengambil semua data obat
router.get('/', async (req, res) => {
    try {
        const { banned } = req.query;
        let query = {};

        // Filter berdasarkan status banned
        if (banned === 'true') {
            query.isBanned = true;
        } else if (banned === 'false') {
            query.isBanned = false;
        }

        const drugs = await Drugs.find(query);
        res.json(drugs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Read - Mengambil data obat berdasarkan ID
router.get('/:id', async (req, res) => {
    try {
        const drug = await Drugs.findById(req.params.id);
        if (!drug) {
            return res.status(404).json({ message: 'Obat tidak ditemukan' });
        }
        res.json(drug);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update - Mengupdate data obat
router.put('/:id', async (req, res) => {
    try {
        const { price, stok } = req.body;

        // Validasi harga dan stok
        if (price <= 0) {
            return res.status(400).json({ message: 'Harga tidak boleh 0 atau kurang dari 0' });
        }

        if (stok < 1) {
            return res.status(400).json({ message: 'Stok minimal harus 1' });
        }

        const updatedDrug = await Drugs.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedDrug) {
            return res.status(404).json({ message: 'Obat tidak ditemukan' });
        }

        res.json(updatedDrug);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete - Menghapus data obat
router.delete('/:id', async (req, res) => {
    try {
        const deletedDrug = await Drugs.findByIdAndDelete(req.params.id);
        if (!deletedDrug) {
            return res.status(404).json({ message: 'Obat tidak ditemukan' });
        }
        res.json({ message: 'Obat berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route untuk banned obat
router.patch('/:id/ban', async (req, res) => {
    try {
        const { reason } = req.body;
        
        if (!reason) {
            return res.status(400).json({ 
                message: 'Alasan banned harus diisi' 
            });
        }

        const drug = await Drugs.findById(req.params.id);
        
        if (!drug) {
            return res.status(404).json({ 
                message: 'Obat tidak ditemukan' 
            });
        }

        if (drug.isBanned) {
            return res.status(400).json({ 
                message: 'Obat sudah dalam keadaan banned' 
            });
        }

        drug.isBanned = true;
        drug.bannedReason = reason;
        drug.status = 'tidak tersedia';

        await drug.save();

        res.json({
            message: 'Obat berhasil dibanned',
            drug
        });
    } catch (error) {
        res.status(500).json({ 
            message: error.message 
        });
    }
});

// Route untuk unban obat
router.patch('/:id/unban', async (req, res) => {
    try {
        const drug = await Drugs.findById(req.params.id);
        
        if (!drug) {
            return res.status(404).json({ 
                message: 'Obat tidak ditemukan' 
            });
        }

        if (!drug.isBanned) {
            return res.status(400).json({ 
                message: 'Obat tidak dalam keadaan banned' 
            });
        }

        drug.isBanned = false;
        drug.bannedReason = null;
        
        // Cek stok sebelum mengubah status
        if (drug.stok > 0) {
            drug.status = 'tersedia';
        }

        await drug.save();

        res.json({
            message: 'Obat berhasil diunban',
            drug
        });
    } catch (error) {
        res.status(500).json({ 
            message: error.message 
        });
    }
});

// Route untuk mengurangi stok obat
router.patch('/:id/reduce-stock', async (req, res) => {
    try {
        const { amount } = req.body;

        // Validasi jumlah yang akan dikurangi
        if (amount <= 0) {
            return res.status(400).json({ message: 'Jumlah yang akan dikurangi harus lebih dari 0' });
        }

        const drug = await Drugs.findById(req.params.id);
        
        if (!drug) {
            return res.status(404).json({ message: 'Obat tidak ditemukan' });
        }

        // Cek apakah stok cukup untuk dikurangi
        if (drug.stok < amount) {
            return res.status(400).json({ message: 'Stok tidak cukup untuk dikurangi' });
        }

        // Kurangi stok
        drug.stok -= amount;

        // Simpan perubahan
        await drug.save();

        res.json({
            message: 'Stok berhasil dikurangi',
            drug
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;