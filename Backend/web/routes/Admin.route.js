const express = require('express')
const router = express()

//Kita akan memanggil model yang sudah diexport, untuk digunakan kembali
const Admin = require('../models/Admin')
const UserData = require('../models/UserData')
const decode = require('jwt-decode');


router.get('/', async (req, res) => {
    // const token = localStorage.getItem('token');
    // console.log(token)
    try {
        const result = await Admin.find();
        if (result.length === 0) {
            return res.status(404).send("No users found");
        }
        return res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching data:", error);
        return res.status(500).send("Server error");
    }
});

router.put('/:userId/verify', async (req, res) => {
  const { userId } = req.params;
  const { isVerified } = req.body; // Pastikan ini boolean
  

//   console.log(token)

  if (typeof isVerified !== 'boolean') {
    return res.status(400).json({ message: 'isVerified must be a boolean.' });
  }

  // Update user with the boolean value
  try {
    const updatedUser = await UserData.findByIdAndUpdate(
      userId,
      { isVerified },
    //   { new: true }  aku gak tau new ne gae opo??
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Error updating verification:", err);
    res.status(500).json({ message: "Error updating verification status." });
  }
});

// butuh tambah update mentor sama update anakmagang

module.exports= router;
