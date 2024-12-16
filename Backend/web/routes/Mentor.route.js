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

router.post("/Soal", async (req, res) => {
    const { name, desc, Gambar, SoalType, Pilihan, kunciJawaban } = req.body;

    // Joi validation schema
    const schema = Joi.object({
        name: Joi.string().required(),
        desc: Joi.string().optional().allow(""),
        Gambar: Joi.string().optional().allow(""),// bakal harus diganti save local pake multer, save db, ato aws(cloud)
        SoalType: Joi.number().required().min(0).max(1),
        Pilihan: Joi.array().items(Joi.string().required()).length(4).optional(),
        kunciJawaban: Joi.number().optional().min(0).max(3),
    }).when(Joi.object({ SoalType: 0 }).unknown(), {
        then: Joi.object({
            Pilihan: Joi.array().items(Joi.string().required()).length(4).required(),
            kunciJawaban: Joi.number().required().min(0).max(3),
        }),

    }).when(Joi.object({ SoalType: 1 }).unknown(), {
        then: Joi.object({
            Gambar: Joi.string().required().uri(), // assuming Gambar is a URL for the image
        }),
    });

    // Validate request body
    const { error } = schema.validate({ ...req.body });
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    try {
        const newSoal = new SoalModul({
            namaSoal: name,
            Deskripsi: desc,
            Gambar:Gambar,
            SoalType: SoalType,
            Pilihan:Pilihan,
            kunciJawaban:kunciJawaban,
        });
        const savedSoal= await newSoal.save();
        // Send success response
        res.status(201).json(savedSoal);
    } catch (err) {
        console.error("Error creating course:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.put("/:id/Soal", async (req, res) => {
    const { id } = req.params;  // Get the ID from the request params
    const { name, desc, Gambar, SoalType, Pilihan, kunciJawaban } = req.body;

    // Joi validation schema
    const schema = Joi.object({
        name: Joi.string().required(),
        desc: Joi.string().optional().allow(""),
        Gambar: Joi.string().optional().allow(""), // bakal harus diganti save local pake multer, save db, ato aws(cloud)
        SoalType: Joi.number().required().min(0).max(1),
        Pilihan: Joi.array().items(Joi.string().required()).length(4).optional(),
        kunciJawaban: Joi.number().optional().min(0).max(3),

    }).when(Joi.object({ SoalType: 0 }).unknown(), {
        then: Joi.object({
            Pilihan: Joi.array().items(Joi.string().required()).length(4).required(),
            kunciJawaban: Joi.number().required().min(0).max(3),
        }),
    }).when(Joi.object({ SoalType: 1 }).unknown(), {
        then: Joi.object({
            Gambar: Joi.string().required().uri(), // assuming Gambar is a URL for the image
        }),
    });

    // Validate request body
    const { error } = schema.validate({ ...req.body });
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
                Gambar: Gambar,
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

router.get("/jawaban",async(req,res)=>{
    const {SoalModulID}=req.query
    const getJawaban = await JawabanModul.findById(SoalModulID)
    if(!getJawaban){
        return res.status(404).json({message:"jawaban not found"})
    }
})


module.exports = router;
