const express = require('express')
const router = express()

const {
    Course, Mentor, Admin, UserData, AnakMagang,
    Modul, JawabanModul, SoalModul, NilaiModul,
    validateArrayOfIDs,
    checkIdValid,
    checkIdExist
} = require("./functions");
const { upload ,verifyToken } = require('./Middleware');
const Joi = require('joi');
const Absensi = require('../models/Absensi');

router.get('/',verifyToken([2]), async (req, res) => {
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

router.get('/:userID/Profile', async (req, res) => {
    const { userID } = req.params;
  
    try {
      // Find the user by userID
      const user = await UserData.findById(userID);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Find the anakMagang record associated with the userID
      const anakMagang = await AnakMagang.findOne({ userID: user._id });
  
      // Prepare course data if anakMagang exists
      let courses = [];
      if (anakMagang) {
        courses = await Course.find({ _id: { $in: anakMagang.courseID } }); // Access courseID from anakMagang instance
      }
  
      // Prepare the response data
      const responseData = {
        user,
        anakMagang: anakMagang || null, // Include anakMagang data if found, otherwise null
        courses: courses || [], // Include courses if found, otherwise empty array
      };
  
      res.status(200).json(responseData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while retrieving data' });
    }
  });


// Modify user and anakMagang information
router.put("/:anakMagangId/ProfileEdit", async (req, res) => {
    const { anakMagangId } = req.params;
    const { namaUser, email, noTelpon, asalSekolah } = req.body;
  
    try {
      // Find the AnakMagang record
      const findUser = await AnakMagang.findById(anakMagangId).populate('userID'); // Populate to get user data
  
      if (!findUser) {
        return res.status(404).json({ message: "AnakMagang not found" });
      }
  
      // Prepare updates for UserData
      const updates = {};
      if (namaUser) updates.namaUser = namaUser;
      if (email) updates.email = email;
      if (noTelpon) updates.noTelpon = noTelpon;
  
      // Update UserData if there are changes
      if (Object.keys(updates).length > 0) {
        const updatedUser = await UserData.findByIdAndUpdate(findUser.userID, updates, { new: true });
  
        if (!updatedUser) {
          return res.status(404).json({ message: "User update failed" });
        }
      }
  
      // Update AsalSekolah for AnakMagang
      if (asalSekolah) {
        findUser.AsalSekolah = asalSekolah;
        await findUser.save(); // Save changes to AnakMagang
      }
  
      res.status(200).json({ user: findUser.userID, anakMagang: findUser });
    } catch (err) {
      console.error("Update error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  router.get('/modul/:courseID', async (req, res) => {
    try {
      const { courseID } = req.params;
  
      // Find all modul documents with the given courseID
      const modulList = await Modul.find({ courseID })
        .populate({
          path: 'soalID', // Populate the soalID array
          model: 'SoalModul', // Reference the SoalModul model
        })
        .populate({
          path: 'absensiID', // Populate the absensiID field
          model: 'Absensi', // Reference the Absensi model
          populate: {
            path: 'absensiKelas.anakMagangID', // Populate the anakMagangID field inside absensiKelas
            model: 'AnakMagang', // Reference the AnakMagang model
          },
        })
        .exec();
  
      // If no modul is found, return a 404 error
      if (!modulList || modulList.length === 0) {
        return res.status(404).json({ message: 'No modul found for the given courseID' });
      }
  
      // Return the modul list with populated soalModul and absensi
      res.status(200).json({ modulList });
    } catch (error) {
      console.error('Error fetching modul:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  });

router.get("/Jawaban",verifyToken([2]), async (req, res) => {
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


router.post("/Jawaban",verifyToken([2]), upload.single("uploadJawaban"), async (req, res) => {
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

// router.get('/:anakMagang_id/absensi', async (req, res) => {
//     const { anakMagang_id } = req.params;

//     try {
//         // Mencari data anak magang berdasarkan id
//         const anakMagang = await AnakMagang.findById(anakMagang_id);

//         // Jika data anak magang tidak ditemukan
//         if (!anakMagang) {
//             return res.status(404).json({ message: 'Anak magang tidak ditemukan.' });
//         }
//         const Absen = await AnakMagang.findByIdAndUpdate(
//             anakMagang_id,
//             {
//                 absensiKelas: [...absensiKelas, new Date()]
//             }
//             , { new: true })
        
//         // Mengembalikan data absensi
//         res.status(200).json({ Absen });
//     } catch (error) {
//         console.error('Error fetching absensi:', error);
//         res.status(500).json({ message: 'Terjadi kesalahan di server.' });
//     }
// });


module.exports = router;
