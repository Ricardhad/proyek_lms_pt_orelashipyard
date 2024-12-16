const express = require('express')
const router = express()

const {
    Course, Mentor, Admin, UserData, AnakMagang,
    Modul, JawabanModul, SoalModul, NilaiModul,
    validateArrayOfIDs,
    checkIdValid
} = require("./functions");

const Joi = require('joi');
const mongoose = require('mongoose');




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
        courseID: Joi.string().custom(checkIdValid, "ObjectId validation").required(),
        soalID: Joi.array().items(Joi.string()).optional(),
        deadline: Joi.date().iso().required(), // ISO date format validation
    });

    // Validate request body
    const { error } = schema.validate({ ...req.body });
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    try {
        // Validate daftarKelas if provided
        let soalIDs
        if (soalID && soalID != []) {
            soalIDs = validateArrayOfIDs(Modul, soalID, "Modul");
        }
        const findCourse = await Course.findById(courseID)
        if (!findCourse) { return res.status(404).json({ message: "course not found" }) }
        // Create new course
        const newModul = new Modul({
            namaModul: name,
            Deskripsi: desc,
            courseID: findCourse,
            soalID: soalIDs || [],
            Deadline: deadline,
            Dinilai: false,
        });
        const savedModul = await newModul.save();
        // Send success response
        res.status(201).json(savedModul);
    } catch (err) {
        console.error("Error creating course:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/Soal", async (req, res) => {
    const { name, desc, Gambar, soalType, Pilihan, kunciJawaban } = req.body;

    // Joi validation schema
    const schema = Joi.object({
        name: Joi.string().required(),
        desc: Joi.string().optional().allow(""),
        gambar: Joi.string().optional().allow(""),
        soalType: Joi.number().required().min(0).max(1),
        Pilihan: Joi.array().items(Joi.string().required()).length(4).optional(),
        kunciJawaban: Joi.number().optional().min(0).max(3),
    });

    // Validate request body
    const { error } = schema.validate({ ...req.body });
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    try {
        // Validate daftarKelas if provided
        // Create new course
        const newSoal = new SoalModul({
            namaSoal: name,
            Deskripsi: desc,
            Gambar,
            soalType,
            Pilihan,
            kunciJawaban,

        });
        const savedSoal= await newSoal.save();
        // Send success response
        res.status(201).json(savedSoal);
    } catch (err) {
        console.error("Error creating course:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.put("/:modulId/Modul", async (req, res) => {
    const { name, desc, courseID, soalID, deadline } = req.body;
    const { modulId } = req.params; // Get modul ID from the URL parameter

    // Joi validation schema
    const schema = Joi.object({
        name: Joi.string().optional(),
        desc: Joi.string().optional().allow(""),
        courseID: Joi.string().custom(checkIdValid, "ObjectId validation").optional(),
        soalID: Joi.array().items(Joi.string()).optional(),
        deadline: Joi.date().iso().optional(), // ISO date format validation
    });

    // Validate request body
    const { error } = schema.validate({ ...req.body });
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        // Find the existing Modul by ID
        const modul = await Modul.findById(modulId);
        if (!modul) {
            return res.status(404).json({ message: "Modul not found" });
        }

        // Validate courseID if provided and check if course exists
        if (courseID) {
            const findCourse = await Course.findById(courseID);
            if (!findCourse) {
                return res.status(404).json({ message: "Course not found" });
            }
            modul.courseID = findCourse;
        }

        // Validate soalID if provided
        if (soalID && soalID.length > 0) {
            const soalIDs = await validateArrayOfIDs(SoalModul, soalID, "Modul");
            modul.soalID = soalIDs;
        }

        // Update other fields if provided
        if (name) modul.namaModul = name;
        if (desc !== undefined) modul.Deskripsi = desc;
        if (deadline) modul.Deadline = deadline;

        // Save the updated Modul
        const updatedModul = await modul.save();

        // Send success response
        res.status(200).json(updatedModul);
    } catch (err) {
        console.error("Error updating Modul:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});


module.exports = router;
