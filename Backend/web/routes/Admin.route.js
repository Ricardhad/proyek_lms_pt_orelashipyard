const express = require('express')
const router = express()

//Kita akan memanggil model yang sudah diexport, untuk digunakan kembali
const Admin = require('../models/Admin')
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

// butuh tambah update mentor sama update anakmagang
router.put("/:anakMagangId/anakMagang", async (req, res) => {
  const { anakMagangId } = req.params;
  const { courseID, asalSekolah } = req.body;

  try {

    const courseExist = await Course.findById(courseID)

    if (courseExist.length > 0) {

      const updatedUser = await AnakMagang.findByIdAndUpdate(
        anakMagangId,
        {
          courseID,
          asalSekolah
        },
        { new: true }  
      );
      res.status(200).json(updatedUser);
    } else {
      res.status(400).json({ message: "course not found" })
    }
  } catch (err) {
    console.log("update error", err)
  }
})


router.put("/:MentorId/Mentor", async (req, res) => {
  const { MentorId } = req.params;
  const { courseID } = req.body; // courseID should be an array of ObjectIds

  try {
    // Ensure courseID contains valid ObjectIds
    const validCourses = await Course.find({ _id: { $in: courseID } });
    if (validCourses.length !== courseID.length) {
      return res.status(400).json({
        message: "One or more courseIDs do not exist in the Course collection",
      });
    }
    const updatedUser = await AnakMagang.findByIdAndUpdate(
      MentorId,
      {
        courseID,
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
