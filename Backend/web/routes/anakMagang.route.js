const express = require('express')
const router = express()

const {
    Course, Mentor, Admin, UserData, AnakMagang,
    Modul, JawabanModul, SoalModul, NilaiModul,
    validateArrayOfIDs,
    checkIdValid
} = require("./functions");
const Joi = require('joi');

router.get('/', async (req, res) => {
    try {
        const result = await AnakMagang.find();
        if (result.length === 0) {
            return res.status(404).send("No users found");
        }
        return res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching data:", error);
        return res.status(500).send("Server error");
    }
});


router.post("/Jawaban", async (req, res) => {
    const { anakMagangID, soalModulID, jawaban, jawabanType, uploadJawaban } = req.body;

    // Joi validation schema
    const schema = Joi.object({
        anakMagangID: Joi.string().required(),
        soalModulID: Joi.string().required(),
        jawabanType: Joi.string().required().valid("essay", "file"),
    })
        .when(Joi.object({ jawabanType: "essay" }).unknown(), {
            then: Joi.object({
                jawaban: Joi.string().required(),
            }),
        })
        .when(Joi.object({ jawabanType: "file" }).unknown(), {
            then: Joi.object({
                uploadJawaban: Joi.object({
                    fileName: Joi.string().required(),
                    filePath: Joi.string().required(),
                    fileType: Joi.string().required(),
                    uploadDate: Joi.date().iso().required(),
                }).required(),
            }),
        });

    // Validate request body
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        // Create a new JawabanModul
        const newJawaban = new JawabanModul({
            anakMagangID,
            soalModulID,
            jawabanType,
            jawaban: jawabanType === "essay" ? jawaban : null,
            uploadJawaban: jawabanType === "file" ? uploadJawaban : null,
        });

        const savedJawaban = await newJawaban.save();

        // Send success response
        res.status(201).json(savedJawaban);
    } catch (err) {
        console.error("Error creating jawaban:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports= router;
