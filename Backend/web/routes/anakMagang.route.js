const express = require('express')
const router = express()

const {
    Course, Mentor, Admin, UserData, AnakMagang,
    Modul, JawabanModul, SoalModul, NilaiModul,
    validateArrayOfIDs,
    checkIdValid
} = require("./functions");

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
    const { anakMagangID, soalModulID,jawaban,jawabanType } = req.body;

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

module.exports= router;
