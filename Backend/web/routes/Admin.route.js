const express = require('express')
const router = express()
const mongoose = require('mongoose');


//Kita akan memanggil model yang sudah diexport, untuk digunakan kembali
const Admin = require('../models/Admin')
const Mentor = require('../models/Mentor')
const UserData = require('../models/UserData')
// const decode = require('jwt-decode');
const AnakMagang = require('../models/AnakMagang');
const Course = require('../models/Course');


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
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Error updating verification:", err);
    res.status(500).json({ message: "Error updating verification status." });
  }
});

router.put("/:anakMagangId/anakMagang", async (req, res) => {
  const { anakMagangId } = req.params;
  const { courseID, asalSekolah } = req.body;

  console.log(anakMagangId)
  try {
    const courseExist = await Course.findById(courseID);
    
    const findUser = await AnakMagang.findById(anakMagangId);
    
    let asal="";
    
    if (asalSekolah && asalSekolah.trim() !== "") {
      asal = asalSekolah;
    }else{
      asal=findUser.AsalSekolah
    }

    if (!courseExist) {
      return res.status(400).json({ message: "Course not found" });
    }

    const updatedUser = await AnakMagang.findByIdAndUpdate(
      anakMagangId,
      {
        courseID,
        AsalSekolah: asal,
      },
      { new: true } 
    );

    if (!findUser) {
      return res.status(404).json({ message: "AnakMagang not found" });
    }

    if (!updatedUser) {
      return res.status(404).json({ message: "update failed" });
    }

    res.status(200).json(updatedUser);

  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.put("/:MentorId/Mentor", async (req, res) => {
  const { MentorId } = req.params;
  const { courseID } = req.body; // courseID should be an array of ObjectIds

  try {
    // Ensure courseID contains valid ObjectIds
    const courseIDs = courseID.map(id => new mongoose.Types.ObjectId(id)); 

    const validCourses = await Course.find({ _id: { $in: courseIDs } });
    // console.log(validCourses)
    // console.log(courseID)

    if (validCourses.length !== courseID.length) {
      return res.status(400).json({
        message: "One or more courseIDs do not exist in the Course collection",
      });
    }
    const updatedUser = await Mentor.findByIdAndUpdate(
      MentorId,
      {
        courseID: courseIDs,
      },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "Mentor not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while updating the mentor" });
  }
});

module.exports = router;
