// routes/userData.route.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

//Kita akan memanggil model yang sudah diexport, untuk digunakan kembali
const UserData = require('../models/UserData')
const Mentor = require('../models/Mentor')
const Admin = require('../models/Admin')
const AnakMagang = require('../models/AnakMagang')

// Middleware untuk autentikasi (contoh sederhana)
const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    console.log("Received Token:", token); // Log the received token
  
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
      req.user = decoded;
      next();
    } catch (err) {
      console.error("Invalid token:", err);
      res.status(400).json({ message: 'Invalid token.' });
    }
  };
  

// Validation schemas
const registerSchema = Joi.object({
    namaUser: Joi.string().required(),
    Profile_Picture: Joi.string().allow(null, ''), // Terima null atau string kosong
    roleType: Joi.number().required(),
    noTelpon: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  const schema = Joi.object({
    isVerified: Joi.boolean().required() // Pastikan ini boolean
  });
  
  
  const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }); 
  


// Register endpoint
router.post('/register', async (req, res) => {
    try {
        // Validasi request body menggunakan Joi
        const { error } = registerSchema.validate(req.body);
        if (error) {
            console.error('Validation error:', error.details[0].message);
            return res.status(400).json({ message: error.details[0].message });
        }

        const { namaUser, Profile_Picture, roleType, noTelpon, email, password } = req.body;

        // Periksa apakah email sudah terdaftar
        const existingUser = await UserData.findOne({ email });
        if (existingUser) {
            console.warn('Email already registered:', email);
            return res.status(400).json({ message: 'Email already registered.' });
        }

        // Hash password untuk keamanan
        const hashedPassword = await bcrypt.hash(password, 10);

        // Buat objek pengguna baru
        const newUser = new UserData({
            namaUser,
            Profile_Picture: Profile_Picture || null,
            roleType,
            noTelpon,
            email,
            password: hashedPassword,
        });

        // Simpan pengguna baru ke database
        const savedUser = await newUser.save();
        console.info(savedUser);

        switch (roleType) {
          case 0:
            
            break;
        
          case 1:
            
            break;
        
          case 2:
            
            break;
        }

        // Generate JWT token tanpa payload, hanya ID pengguna
        const token = jwt.sign(
            { userId: savedUser._id.toString() },  // Hanya ID pengguna sebagai data dalam token
            process.env.JWT_SECRET || 'your_jwt_secret', // Secret key
            { expiresIn: '24h' } // Expiration time
        );

        // Kirim respons sukses dengan token
        res.status(201).json({
            message: 'User registered successfully.',
            userId: savedUser._id,
            token,  // Kirim token yang dihasilkan
        });
    } catch (error) {
        console.error('Error during user registration:', error);
        res.status(500).json({ message: 'Error registering user.', error: error.message });
    }
});


  
  // Login endpoint
  router.post('/login', async (req, res) => {
    try {
      const { error } = loginSchema.validate(req.body);
      if (error) return res.status(400).json({ message: error.details[0].message });
  
      const { email, password } = req.body;
  
      // Check if user exists
      const user = await UserData.findOne({ email });
      if (!user) return res.status(400).json({ message: 'Invalid email or password.' });
  
      // Check if user is verified
      if (!user.isVerified) return res.status(403).json({ message: 'User not verified.' });
  
      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid email or password.' });
  
      // Generate JWT token
      const token = jwt.sign(
        { id: user._id, email: user.email, roleType: user.roleType },
        process.env.JWT_SECRET || 'your_jwt_secret',
        { expiresIn: '24h' }
      );
  
      res.status(200).json({ message: 'Login successful.', token });
    } catch (error) {
      res.status(500).json({ message: 'Error logging in.', error });
    }
  });

  router.get('/all', async (req, res) => {
    try {
      const users = await UserData.find(); // Mengambil semua data dari koleksi UserData
      if (users.length === 0) {
        return res.status(404).json({ message: "No users found" });
      }
      res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  // Endpoint Update Status Verified
  router.put('/:userId/verify', async (req, res) => {
    const { userId } = req.params;
    const { isVerified } = req.body; // Pastikan ini boolean
  
    if (typeof isVerified !== 'boolean') {
      return res.status(400).json({ message: 'isVerified must be a boolean.' });
    }
  
    // Update user with the boolean value
    try {
      const updatedUser = await UserData.findByIdAndUpdate(
        userId,
        { isVerified },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      console.error("Error updating verification:", err);
      res.status(500).json({ message: "Error updating verification status." });
    }
  });
  
  

  
  module.exports = router;
  


