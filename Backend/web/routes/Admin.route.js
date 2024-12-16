const express = require('express')
const router = express()
const mongoose = require('mongoose');


const Admin = require('../models/Admin')
const Mentor = require('../models/Mentor')
const UserData = require('../models/UserData')
const AnakMagang = require('../models/AnakMagang');
const Course = require('../models/Course');
const Joi = require('joi');


const validateArrayOfIDs = async (model, mappedId, modelName) => {

  if (!Array.isArray(mappedId)) {
    throw new Error(`${modelName} IDs must be provided as an array.`);
  }

  let ids;
  try {
    ids = mappedId.map((id) => new mongoose.Types.ObjectId(id));
  } catch (err) {
    throw new Error(`Invalid ${modelName} ID format.`);
  }

  const validDocuments = await model.find({ _id: { $in: ids } });

  if (validDocuments.length !== ids.length) {
    throw new Error(`One or more IDs do not exist in the ${modelName} collection.`);
  }

  return validDocuments.map((doc) => doc._id);
};
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

    let asal = "";

    if (asalSekolah && asalSekolah.trim() !== "") {
      asal = asalSekolah;
    } else {
      asal = findUser.AsalSekolah
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
    // const courseIDs = courseID.map(id => new mongoose.Types.ObjectId(id));

    // const validCourses = await Course.find({ _id: { $in: courseIDs } });

    // if (validCourses.length !== courseID.length) {
    //   return res.status(400).json({
    //     message: "One or more courseIDs do not exist in the Course collection",
    //   });
    // }

    const courseIDs= await validateArrayOfIDs(Course,courseID,"Course")

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

router.post("/Course", async (req, res) => {
  const { name, desc, MentorID, daftarKelas } = req.body;

  // Joi validation schema
  const schema = Joi.object({
    name: Joi.string().required(),
    desc: Joi.string().optional().allow(""),
    MentorID: Joi.array().items(Joi.string()).optional(),
    daftarKelas: Joi.array().items(Joi.string()).optional(),
  });

  // Validate request body
  const { error } = schema.validate({ name, desc, MentorID, daftarKelas });
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    // Validate daftarKelas if provided
    let daftarCourse
    if (daftarKelas) {
      daftarCourse= await validateArrayOfIDs(AnakMagang,daftarKelas,"AnakMagang")
    }
    // Check if MentorID exists\
    let daftarMentor
    if (MentorID) {
       daftarMentor= await validateArrayOfIDs(Mentor,MentorID,"Mentor")
    }
    // Create new course
    const newCourse = new Course({
      namaCourse: name,
      Deskripsi: desc,
      mentorID: daftarMentor || [],
      daftarKelas: daftarCourse || [],
    });

    const savedCourse = await newCourse.save();

    // Send success response
    res.status(201).json(savedCourse);
  } catch (err) {
    console.error("Error creating course:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


module.exports = router;
