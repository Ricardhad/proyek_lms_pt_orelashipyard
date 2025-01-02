const express = require('express')
const router = express()

const {
    Course, Mentor, Admin, UserData, AnakMagang,
    Modul, JawabanModul, SoalModul, NilaiModul,
    validateArrayOfIDs,
    checkIdValid,
    checkIdExist,
    validateArrayOfIDsCheckRole
} = require("./functions");

const Joi = require('joi');
const mongoose = require('mongoose');
const { upload, verifyToken } = require('./Middleware');
const anakMagang = require('../models/AnakMagang');
const Absensi = require('../models/Absensi');




router.get('/', verifyToken([1]),async (req, res) => {
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

router.put("/:MentorId/Profile",verifyToken([0]), async (req, res) => {
  const { MentorId } = req.params;
  const { courseID } = req.body; // courseID should be an array of ObjectIds

  try {

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
router.get('/:userID/Profile', async (req, res) => {
    const { userID } = req.params;
  
    try {
      // Find the user by userID
      const user = await UserData.findById(userID);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Find the mentor associated with the userID
      const mentor = await Mentor.findOne({ userID });
      
      // Prepare the response data
      const responseData = {
        user,
        mentor: mentor || null, // Include mentor data if found, otherwise null
      };
  
      res.status(200).json(responseData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while retrieving data' });
    }
  });

router.get("/Modul",verifyToken([1]), async (req, res) => {
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
router.get("/Soal",verifyToken([1]), async (req, res) => {
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

router.post("/Modul",verifyToken([1]), async (req, res) => {
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
router.post("/Soal",verifyToken([1]), upload.single("uploadSoal"), async (req, res) => {
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


router.put("/:id/Soal",verifyToken([1]), upload.single("uploadSoal"), async (req, res) => {
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


router.put("/:modulId/Modul",verifyToken([1]), async (req, res) => {
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

router.get("/Jawaban",verifyToken([1]), async (req, res) => {
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
            { $unwind: '$course' },
            {
                $lookup: {
                    from: 'SoalModul', // assuming the collection name for soalModul is 'soalModuls'
                    localField: 'soalModulID',
                    foreignField: '_id',
                    as: 'soalModul'
                }
            },
            { $unwind: '$soalModul' },
            {
                $lookup: {
                    from: 'AnakMagang', // assuming the collection name for anakMagang is 'anakMagangs'
                    localField: 'anakMagangID',
                    foreignField: '_id',
                    as: 'anakMagang'
                }
            },
            { $unwind: '$anakMagang' },
            {
                $lookup: {
                    from: 'UserData', // assuming the collection name for user is 'users'
                    localField: 'anakMagang.userID',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: '$user' },
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

router.post("/:ModulID/nilai",verifyToken([1]), async (req, res) => {
    const { ModulID } = req.params;
    const { mentorID, anakMagangID, catatan, nilai, courseID } = req.body;

    // Define the Joi schema for validation
    const schema = Joi.object({
        ModulID: Joi.string().custom(checkIdValid, "ObjectId validation").required(),
        mentorID: Joi.string().custom(checkIdValid, "ObjectId validation").required(),
        anakMagangID: Joi.string().custom(checkIdValid, "ObjectId validation").required(),
        courseID: Joi.string().custom(checkIdValid, "ObjectId validation").required(),
        catatan: Joi.string().optional().allow(''),
        nilai: Joi.number().min(0).max(100).required()
    });
    // Validate the request body
    const { error } = schema.validate({ ...req.body, ModulID });
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    const existModul = await Modul.findById(ModulID)
    const existMentor = await Mentor.findById(mentorID)
    const existAnakMagang = await AnakMagang.findById(anakMagangID)
    const existCourse = await Course.findById(courseID)

    if (!existModul) {
        return res.status(404).json({ message: "Modul ID not found" });
    }
    if (!existMentor) {
        return res.status(404).json({ message: "Mentor ID not found" });
    }
    if (!existAnakMagang) {
        return res.status(404).json({ message: "Anak Magang ID not found" });
    }
    if (!existCourse) {
        return res.status(404).json({ message: "Course ID not found" });
    }

    try {
        const nilaiModul = new NilaiModul({
            anakMagangID,
            courseID,
            mentorID,
            modulID: ModulID,
            catatan,
            nilai,
        });
        const hasil = await nilaiModul.save();
        return res.status(200).json(hasil);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error." });
    }
});
router.put("/:nilaiModulID/nilai",verifyToken([1]), async (req, res) => {
    const { nilaiModulID } = req.params;
    const { modulID, mentorID, anakMagangID, catatan, nilai, courseID } = req.body;

    // Define the Joi schema for validation
    const schema = Joi.object({
        nilaiModulID: Joi.string().custom(checkIdValid, "ObjectId validation").required(),
        modulID: Joi.string().custom(checkIdValid, "ObjectId validation").optional(),
        mentorID: Joi.string().custom(checkIdValid, "ObjectId validation").optional(),
        anakMagangID: Joi.string().custom(checkIdValid, "ObjectId validation").optional(),
        courseID: Joi.string().custom(checkIdValid, "ObjectId validation").optional(),
        catatan: Joi.string().optional().allow(''),
        nilai: Joi.number().min(0).max(100).required()
    });

    // Validate the request body
    const { error } = schema.validate({ ...req.body, nilaiModulID });
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    // Check if the provided IDs exist in the database
    const existNilaiModul = await NilaiModul.findById(nilaiModulID);
    const existModul = modulID ? await Modul.findById(modulID) : null;
    const existMentor = mentorID ? await Mentor.findById(mentorID) : null;
    const existAnakMagang = anakMagangID ? await AnakMagang.findById(anakMagangID) : null;
    const existCourse = courseID ? await Course.findById(courseID) : null;

    if (!existNilaiModul) {
        return res.status(404).json({ message: "NilaiModul ID not found" });
    }
    if (modulID && !existModul) {
        return res.status(404).json({ message: "Modul ID not found" });
    }
    if (mentorID && !existMentor) {
        return res.status(404).json({ message: "Mentor ID not found" });
    }
    if (anakMagangID && !existAnakMagang) {
        return res.status(404).json({ message: "Anak Magang ID not found" });
    }
    if (courseID && !existCourse) {
        return res.status(404).json({ message: "Course ID not found" });
    }

    try {
        // Use findByIdAndUpdate with the nilaiModulID to find the record and update it
        const updatedNilaiModul = await NilaiModul.findByIdAndUpdate(
            nilaiModulID,
            {
                modulID: modulID || existNilaiModul.modulID, // Only update if provided
                mentorID: mentorID || existNilaiModul.mentorID, // Only update if provided
                anakMagangID: anakMagangID || existNilaiModul.anakMagangID, // Only update if provided
                courseID: courseID || existNilaiModul.courseID, // Only update if provided
                catatan: catatan || existNilaiModul.catatan, // Only update if provided
                nilai: nilai || existNilaiModul.nilai, // Only update if provided
            },
            { new: true } // Ensure the updated document is returned
        );

        if (!updatedNilaiModul) {
            return res.status(404).json({ message: "NilaiModul not found or failed to update" });
        }

        return res.status(200).json(updatedNilaiModul);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error." });
    }
});

//rey absensi
// Endpoint untuk mengabsensi anak magang
router.post('/absensi',verifyToken([1]), async (req, res) => {
    const {courseID, mentorID, anakMagangID } = req.body;

    const schema = Joi.object({
        courseID: Joi.string().required().custom(checkIdValid,"object validation").messages({
            'string.base': 'course ID must be a string.',
            'string.empty': 'course ID cannot be empty.',
            'any.required': 'course ID is required.',
        }),
        mentorID: Joi.string().required().custom(checkIdValid,"object validation").messages({
            'string.base': 'Mentor ID must be a string.',
            'string.empty': 'Mentor ID cannot be empty.',
            'any.required': 'Mentor ID is required.',
        }),
        anakMagangID: Joi.array().items(
            Joi.string().required().messages({
                'string.base': 'Each Anak Magang ID must be a string.',
                'string.empty': 'An Anak Magang ID cannot be empty.',
                'any.required': 'An Anak Magang ID is required.',
            })
        ).required().messages({
            'array.base': 'Anak Magang IDs must be an array.',
            'array.includesRequiredUnknowns': 'Anak Magang IDs must contain valid strings.',
            'any.required': 'Anak Magang IDs are required.',
        }),
    });

    // Usage
    const { error, value } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    try {
        // Check if the mentor exists
        const coursefind = await Course.findById(courseID);
        if (!coursefind) {
            return res.status(403).json({ message: 'course not found in the database' });
        }

        const mentorUser = await Mentor.findById(mentorID);
        if (!mentorUser) {
            return res.status(403).json({ message: 'Mentor not found in the database' });
        }
        const checkCourseMentor = mentorUser.courseID
        // const checking =checkIdValid(coursefind)
        // console.log(checking)
        // let find =false
        for (const id of checkCourseMentor){
            if(id == coursefind.id){
                find = true
            }
        }
        if(!find){
            return res.status(404).json({ message: 'courseId not found in mentor' });
        }


        // Validate anakMagangID array
        const validatedIds = await validateArrayOfIDs(AnakMagang, anakMagangID, "anakMagang");
        console.log(validatedIds);
        const today = new Date();

        // Update each AnakMagang's absensiKelas field
        for (const id of validatedIds) {
            const anakMagangData = await AnakMagang.findById(id);
            anakMagangData.absensiKelas.push(today); // Push attendance date
            await anakMagangData.save(); // Save updated document
        }

        // Create new Absensi document
        const absenToday = new Absensi({
            courseID: coursefind.id,
            tanggalAbsensi: today,
            absensiKelas: validatedIds, // Use validated IDs
        });

        const newAbsenRes = await absenToday.save();

        res.status(200).json({
            message: 'Attendance successfully recorded',
            newAbsenRes,
        });
    } catch (error) {
        console.error('Error processing attendance:', error);
        res.status(500).json({ message: 'An error occurred on the server.' });
    }
});
router.put('/:id/absensi',verifyToken([1]), async (req, res) => {
    const id = req.params.id;
    const { mentorID, anakMagangID } = req.body;

    try {
        // Validate Mentor existence and role
        const mentorUser = await Mentor.findById(mentorID);
        if (!mentorUser) {
            return res.status(403).json({ message: 'Mentor not found in the database' });
        }

        const mentorInUser = await UserData.findById(mentorUser.userID);
        if (!mentorInUser || mentorInUser.roleType !== 1) {
            return res.status(400).json({ message: 'User is not eligible to update attendance' });
        }

        // Validate AnakMagang IDs
        const validatedIds = await validateArrayOfIDsCheckRole(AnakMagang, anakMagangID, 'anakMagang', 2);

        // Find existing attendance record by ID
        let attendanceRecord = await Absensi.findById(id);

        if (attendanceRecord) {
            // Update the attendance record
            attendanceRecord.absensiKelas = [...new Set([...attendanceRecord.absensiKelas, ...validatedIds])]; // Ensure unique IDs
            await attendanceRecord.save();

            // Update AnakMagang's attendance field
            const today = attendanceRecord.tanggalAbsensi;
            for (const anakID of validatedIds) {
                const anakMagangData = await AnakMagang.findById(anakID);
                if (!anakMagangData.absensiKelas.includes(today)) {
                    anakMagangData.absensiKelas.push(today); // Push attendance date
                    await anakMagangData.save();
                }
            }

            return res.status(200).json({
                message: 'Attendance record updated successfully.',
                updatedAttendance: attendanceRecord,
            });
        } else {
            // Create a new attendance record if not found
            const today = new Date().toISOString().split('T')[0]; // Format date as YYYY-MM-DD
            const newAttendance = new Absensi({
                _id: id,
                courseID: mentorUser.courseID,
                tanggalAbsensi: today,
                absensiKelas: validatedIds,
            });

            await newAttendance.save();

            // Update AnakMagang's attendance field
            for (const anakID of validatedIds) {
                const anakMagangData = await AnakMagang.findById(anakID);
                anakMagangData.absensiKelas.push(today); // Push attendance date
                await anakMagangData.save();
            }

            return res.status(201).json({
                message: 'New attendance record created successfully.',
                newAttendance,
            });
        }
    } catch (error) {
        console.error('Error processing attendance update:', error);
        res.status(500).json({ message: 'An error occurred on the server.', error: error.message });
    }
});



module.exports = router;
