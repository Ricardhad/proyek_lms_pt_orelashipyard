const express = require('express')
const router = express()

const mongoose = require('mongoose');

const Mentor = require('../models/Mentor');
const Admin = require('../models/Admin')
const UserData = require('../models/UserData')
const AnakMagang = require('../models/AnakMagang');
const Course = require('../models/Course');
const Joi = require('joi');


router.get('/', async (req, res) => {
    try {
        const result = await Mentor.find();
        if (result.length === 0) {
            return res.status(404).send("No users found");
        }
        return res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching data:", error);
        return res.status(500).send("Server error");
    }
});


router.post("/Modul", async (req, res) => {
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

module.exports= router;
