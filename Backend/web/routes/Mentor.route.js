const express = require('express')
const router = express()

const {
    Course, Mentor, Admin, UserData, AnakMagang,
    Modul, JawabanModul, SoalModul, NilaiModul,
    validateArrayOfIDs
} = require("./functions");

const Joi = require('joi');
const mongoose= require('mongoose');




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
    const { name, desc, courseID, soalID, deadline } = req.body;

    // Joi validation schema
    const schema = Joi.object({
        name: Joi.string().required(),
        desc: Joi.string().optional().allow(""),
        courseID: Joi.string().custom(checkIdValid, "ObjectId validation").optional(),
        soalID: Joi.array().items(Joi.string().custom(checkIdValid, "ObjectId validation")).optional(),
        deadline: Joi.date().iso().required(), // ISO date format validation
    });

    // Validate request body
    const { error } = schema.validate({ ...req.body });
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }


    try {
        // Validate daftarKelas if provided
        const soalIDs = validateArrayOfIDs(Modul, soalID, "soalID");

        // Create new course
        const newModul = new Modul({
            namaCourse: name,
            Deskripsi: desc,
            courseID:courseID||[],
            soalID: soalIDs||[],
            Deadline: deadline,
            Dinilai: false,
        });
        const savedCourse = await newModul.save();
        // Send success response
        res.status(201).json(savedCourse);
    } catch (err) {
        console.error("Error creating course:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
