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
const { upload } = require('./Middleware');
const anakMagang = require('../models/AnakMagang');




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


router.get("/Modul", async (req, res) => {
    const { filter } = req.query;
    let search;
    if (filter) {
        search = await Modul.find({ namaModul: { $regex: filter, $options: 'i' } });
        if (search.length === 0) {
            search = await Modul.find({ Deskripsi: { $regex: filter, $options: 'i' } });
        }
    } else {
        search = await Modul.find();
    }
    if (search.length === 0) {
        return res.status(404).json({ message: "No results found" });
    }
    return res.status(200).json(search);
})
router.get("/Soal", async (req, res) => {
    const { filter, SoalType } = req.query;
    let search;
    if (filter) {
        search = await SoalModul.find({ namaSoal: { $regex: filter, $options: 'i' } });
        if (search.length === 0) {
            search = await SoalModul.find({ Deskripsi: { $regex: filter, $options: 'i' } });
        }
    } else if (SoalType) {
        search = await SoalModul.find({ SoalType: parseInt(SoalType) });
    } else {
        search = await SoalModul.find();
    }
    if (search.length === 0) {
        return res.status(404).json({ message: "No results found" });
    }
    return res.status(200).json(search);
})

router.post("/Modul", async (req, res) => {
    const { name, desc, courseID, soalID, deadline } = req.body;

    // Joi validation schema
    const schema = Joi.object({
        name: Joi.string().required(),
        desc: Joi.string().optional().allow(""),
        courseID: Joi.string().custom(checkIdValid, "ObjectId validation").required(),
        soalID: Joi.array().items(Joi.string()).optional(),
        deadline: Joi.date().iso().min(new Date(Date.now() + 60 * 60 * 1000)).required()
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


// POST route
router.post("/Soal", upload.single("uploadSoal"), async (req, res) => {
    const { name, desc, SoalType, Pilihan, kunciJawaban } = req.body;

    // Process file upload if present
    const uploadSoal = req.file
        ? {
            fileName: req.file.filename,
            filePath: req.file.path,
            fileType: req.file.mimetype,
            uploadDate: new Date(),
        }
        : null;
    // console.log(req.file)

    // Joi validation schema
    const schema = Joi.object({
        name: Joi.string().required(),
        desc: Joi.string().optional().allow(""),
        SoalType: Joi.number().required().valid(0, 1, 2),
        Pilihan: Joi.array().items(Joi.string().required()).length(4).optional(),
        kunciJawaban: Joi.number().optional().min(0).max(3),
        uploadSoal: Joi.object({
            fileName: Joi.string().required(),
            filePath: Joi.string().required(),
            fileType: Joi.string().required(),
            uploadDate: Joi.date().iso().required(),
        }).optional(),
    })
        .when(Joi.object({ SoalType: 0 }).unknown(), {
            then: Joi.object({
                Pilihan: Joi.array().items(Joi.string().required()).length(4).required(),
                kunciJawaban: Joi.number().required().min(0).max(3),
            }),
        })
        .when(Joi.object({ SoalType: Joi.valid(1, 2) }).unknown(), {
            then: Joi.object({
                uploadSoal: Joi.object({
                    fileName: Joi.string().required(),
                    filePath: Joi.string().required(),
                    fileType: Joi.string().required(),
                    uploadDate: Joi.date().iso().required(),
                }).required(),
            }),
        });

    // Validate request body and file
    const { error } = schema.validate({ ...req.body, uploadSoal });
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        // Create a new SoalModul document
        const newSoal = new SoalModul({
            namaSoal: name,
            Deskripsi: desc,
            Gambar: uploadSoal, // File data should be passed here as an object
            SoalType: SoalType,
            Pilihan: Pilihan,
            kunciJawaban: kunciJawaban,
        });

        const savedSoal = await newSoal.save();

        // Send success response
        res.status(201).json(savedSoal);
    } catch (err) {
        console.error("Error creating soal:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});


router.put("/:id/Soal", upload.single("uploadSoal"), async (req, res) => {
    const { id } = req.params;  // Get the ID from the request params
    const { name, desc, SoalType, Pilihan, kunciJawaban } = req.body;

    const uploadSoal = req.file
        ? {
            fileName: req.file.filename,
            filePath: req.file.path,
            fileType: req.file.mimetype,
            uploadDate: new Date(),
        }
        : null;
    // console.log(req.file.filename)

    // Joi validation schema
    const schema = Joi.object({
        name: Joi.string().optional(),
        desc: Joi.string().optional().allow(""),
        SoalType: Joi.number().required().valid(0, 1, 2),
        Pilihan: Joi.array().items(Joi.string().required()).length(4).optional(),
        kunciJawaban: Joi.number().optional().min(0).max(3),
        uploadSoal: Joi.object({
            fileName: Joi.string().required(),
            filePath: Joi.string().required(),
            fileType: Joi.string().required(),
            uploadDate: Joi.date().iso().required(),
        }).optional()
    })
        .when(Joi.object({ SoalType: 0 }).unknown(), {
            then: Joi.object({
                Pilihan: Joi.array().items(Joi.string().required()).length(4).required(),
                kunciJawaban: Joi.number().required().min(0).max(3),
            }),
        })
        .when(Joi.object({ SoalType: Joi.valid(1, 2) }).unknown(), {
            then: Joi.object({
                uploadSoal: Joi.object({
                    fileName: Joi.string().required(),
                    filePath: Joi.string().required(),
                    fileType: Joi.string().required(),
                    uploadDate: Joi.date().iso().required(),
                }).required(),
            }),
        });

    // Validate request body and file
    const { error } = schema.validate({ ...req.body, uploadSoal });
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        // Find and update the existing Soal
        const updatedSoal = await SoalModul.findByIdAndUpdate(
            id,  // Find the Soal by its ID
            {
                namaSoal: name,
                Deskripsi: desc,
                Gambar: uploadSoal,
                SoalType: SoalType,
                Pilihan: Pilihan,
                kunciJawaban: kunciJawaban,
            },
            { new: true } // Return the updated document
        );

        if (!updatedSoal) {
            return res.status(404).json({ message: "Soal not found" });
        }

        // Send success response
        res.status(200).json(updatedSoal);
    } catch (err) {
        console.error("Error updating soal:", err);
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
        deadline: Joi.date().iso().min(new Date(Date.now() + 60 * 60 * 1000)).required(), // ISO date format validation
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

router.get("/Jawaban", async (req, res) => {
    const { namaCourse, namaSoal, namaUser, jawabanType } = req.query;

    try {
        let pipeline = [
            {
                $lookup: {
                    from: 'Course', // assuming the collection name for the course model is 'courses'
                    localField: 'courseID',
                    foreignField: '_id',
                    as: 'course'
                }
            },
            {$unwind: '$course'},
            {
                $lookup: {
                    from: 'SoalModul', // assuming the collection name for soalModul is 'soalModuls'
                    localField: 'soalModulID',
                    foreignField: '_id',
                    as: 'soalModul'
                }
            },
            {$unwind: '$soalModul'},
            {
                $lookup: {
                    from: 'AnakMagang', // assuming the collection name for anakMagang is 'anakMagangs'
                    localField: 'anakMagangID',
                    foreignField: '_id',
                    as: 'anakMagang'
                }
            },
            {$unwind: '$anakMagang'},
            {
                $lookup: {
                    from: 'UserData', // assuming the collection name for user is 'users'
                    localField: 'anakMagang.userID',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {$unwind: '$user'},
            {
                $match: {
                    $or: [
                        { 'course.namaCourse': { $regex: new RegExp(namaCourse, 'i') } },
                        { 'soalModul.namaSoal': { $regex: new RegExp(namaSoal, 'i') } },
                        { 'user.namaUser': { $regex: new RegExp(namaUser, 'i') } },
                        { 'jawabanType': { $regex: new RegExp(jawabanType, 'i') } }
                    ]
                }
            }
        ];

        const results = await JawabanModul.aggregate(pipeline);

        if (results.length === 0) {
            return res.status(404).json({ message: "No results found" });
        }

        return res.status(200).json(results);
    } catch (error) {
        console.error("Error fetching JawabanModul data:", error);
        return res.status(500).json({ message: "Server error" });
    }
});


router.post("/:ModulID/nilai" ,async (req, res) => {
    const { ModulID } = req.params;
    const {mentorID,anakMagangID, catatan, nilai,courseID}= req.body;
    const modul = await Modul.findById(ModulID)
    const mentor = await Mentor.findById(mentorID)
    const anakmagang = await AnakMagang.findById(anakMagangID)
    const course = await Course.findById(courseID)
    
    const nilaiModul = await new NilaiModul({
        anakMagangID: anakmagang,
        courseID: course,
        mentorID: mentor, // File data should be passed here as an object
        modulID: modul,
        catatan,
        nilai,
    });
    if (!nilaiModul) {
        return res.status(404).json({ message: "jawaban not found" })
    }

    
    return res.status(200).json(nilaiModul);
})


module.exports = router;
