const express = require('express')
const router = express()

const {
    Course, Mentor, Admin, UserData, AnakMagang,
    Modul, JawabanModul, SoalModul, NilaiModul,
    validateArrayOfIDs,
    checkIdValid,
    checkIdExist
} = require("./functions");
const { upload } = require('./Middleware');
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

// Helper function to perform the search
const searchJawabanModul = async (query) => {
    let searchQuery = JawabanModul.find()
        .populate('courseID', 'namaCourse')
        .populate('soalModulID', 'namaSoal')
        .populate({
            path: 'anakMagangID',
            populate: { path: 'userID', select: 'namaUser' }
        });

    // Filter based on query parameters
    if (query.namaCourse || query.namaSoal || query.namaUser) {
        searchQuery = searchQuery.find({
            $or: [
                { 'courseID.namaCourse': { $regex: query.namaCourse, $options: 'i' } },
                { 'soalModulID.namaSoal': { $regex: query.namaSoal, $options: 'i' } },
                { 'anakMagangID.userID.namaUser': { $regex: query.namaUser, $options: 'i' } }
            ]
        });
    }
    if (query.jawabanType) {
        searchQuery = searchQuery.find({ jawabanType: parseInt(query.jawabanType) });
    }

    return await searchQuery;
};

router.get("/Jawaban", async (req, res) => {
    const { namaCourse, namaSoal, namaUser, jawabanType } = req.query;

    try {
        // Call the helper function to fetch data
        let search = await searchJawabanModul(req.query);

        if (!search || search.length === 0) {
            return res.status(404).json({ message: "No results found" });
        }

        return res.status(200).json(search);
    } catch (error) {
        console.error("Error fetching JawabanModul data:", error);
        return res.status(500).json({ message: "Server error" });
    }
});


router.post("/Jawaban", upload.single("uploadJawaban"), async (req, res) => {
    const { anakMagangID, courseID, soalModulID, jawaban, jawabanType } = req.body;
    const uploadJawaban = req.file ? {
        fileName: req.file.filename,
        filePath: req.file.path,
        fileType: req.file.mimetype,
        uploadDate: new Date(),
    } : null;

    // Joi validation schema
    const schema = Joi.object({
        courseID: Joi.string().custom(checkIdValid).required(),
        anakMagangID: Joi.string().custom(checkIdValid).required(),
        soalModulID: Joi.string().custom(checkIdValid).required(),
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
    const { error } = schema.validate({ ...req.body, uploadJawaban });
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        // Create a new JawabanModul
        const findCourse = await checkIdExist(Course, courseID);
        const findAnakMagang = await checkIdExist(AnakMagang, anakMagangID);
        const findSoal = await checkIdExist(SoalModul, soalModulID);

        if (!findCourse && !findAnakMagang && !findSoal) {
            return res.status(404).json({ message: 'id from soal anakMagang or course not found' })
        }

        const newJawaban = new JawabanModul({
            courseID,
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


module.exports = router;
