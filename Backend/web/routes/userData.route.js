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
const AnakMagang = require('../models/AnakMagang');
const { Course } = require('./functions');

// Middleware untuk autentikasi (contoh sederhana)



// Validation schemas
const registerSchema = Joi.object({
  namaUser: Joi.string().required(),
  Profile_Picture: Joi.string().allow(null, ''), // Terima null atau string kosong
  roleType: Joi.number().valid(0,1,2).required(),
  noTelpon: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  course: Joi.string().optional(),
  asalSekolah: Joi.string().when('roleType', {
    is: 2, // Only required when roleType is 2 (Anak Magang)
    then: Joi.required(),
    otherwise: Joi.optional()
  })
});

const schema = Joi.object({
  isVerified: Joi.boolean().required() // Pastikan ini boolean
});


const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});



router.get('/courses', async (req, res) => {
  try {
      const result = await Course.find();
      if (result.length === 0) {
          return res.status(404).send("No Course found");
      }
      return res.status(200).json(result);
  } catch (error) {
      console.error("Error fetching data:", error);
      return res.status(500).send("Server error");
  }
});

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    // Validasi request body menggunakan Joi
    const { namaUser, Profile_Picture, roleType, noTelpon,email, password,course,asalSekolah } = req.body;
    console.log(req.body)
    const { error } = registerSchema.validate(req.body);
    if (error) {
      console.error('Validation error:', error.details[0].message);
      return res.status(400).json({ message: error.details[0].message });
    }

    // Periksa apakah email sudah terdaftar
    const existingUser = await UserData.findOne({ email });
    if (existingUser) {
      console.warn('Email already registered:', email);
      return res.status(400).json({ message: 'Email already registered.' });
    }
    let courseExist 
    if(course !="" && course){
      courseExist = await Course.findOne({namaCourse: course})
      if (!courseExist) {
        return res.status(400).json({ message: 'course not found' });
      }
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
    const roleTypeParsed = parseInt(roleType)
    if (roleTypeParsed === 0) {
      const newAdmin = new Admin({ userID: savedUser._id });
      const savedAdmin = await newAdmin.save();
      console.info('Admin profile created:', savedAdmin);
    } else if (roleTypeParsed === 1) {
      const newMentor = new Mentor({ 
        userID: savedUser._id,
        courseID: [courseExist.id] || null
       });
      const savedMentor = await newMentor.save();
      console.info('Mentor profile created:', savedMentor);
    } else if (roleTypeParsed === 2) {
      const newAnakMagang = new AnakMagang({ 
        userID: savedUser._id,
        courseID: courseExist.id || null,
        AsalSekolah: asalSekolah
       });
      const savedAnakMagang = await newAnakMagang.save();
      console.info('Anak Magang profile created:', savedAnakMagang);
    } else {
      console.warn('Invalid roleType:', roleType);
      return res.status(400).json({ message: 'Invalid roleType provided.' });
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
      savedUser,
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
    // Validasi input login
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { email, password } = req.body;

    // Cek apakah pengguna ada di database
    const user = await UserData.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password.' });

    // Cek apakah pengguna sudah diverifikasi
    if(user.roleType!=0){
      if (!user.isVerified) return res.status(403).json({ message: 'User not verified.' });
    }

    // Cek apakah password yang dimasukkan sesuai dengan password yang ada di database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password.' });
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, roleType: user.roleType },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '24h' }
    );
    console.log({id: user._id, email: user.email, roleType: user.roleType})

    
    

    // Cek roleType dan arahkan sesuai dengan role
    let roleBasedRedirect = '';
    switch (user.roleType) {
      case 0: // Admin
        roleBasedRedirect = '/admin/home';
        break;
      case 1: // Mentor
        roleBasedRedirect = '/mentor/home';
        break;
      case 2: // Anak Magang
        roleBasedRedirect = '/intern/home';
        break;
      default:
        return res.status(400).json({ message: 'Invalid user role.' });
    }

    // Kirim response dengan token dan halaman tujuan berdasarkan role
    res.status(200).json({ 
      message: 'Login successful.',
      token,
      roleBasedRedirect,
      

    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging in.', error: error.message });
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

router.get('/allUnverifiedIntern', async (req, res) => {
  try {
    // Fetch users who are not verified and have roleType of 2
    const users = await UserData.find({ isVerified: false, roleType: 2 }); // Adjust the field names as needed

    if (users.length === 0) {
      return res.status(404).json({ message: "No unverified interns found" });
    }

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
});
router.post('/RegisterIntern', async (req, res) => {
  try {
    const { AsalSekolah, courseID, userID, absensiKelas } = req.body;

    // Create a new anakMagang document
    const newAnakMagang = new AnakMagang({
      AsalSekolah,
      courseID,
      userID,
      absensiKelas
    });

    await newAnakMagang.save();
    res.status(201).json(newAnakMagang);
  } catch (error) {
    console.error("Error registering intern:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;



