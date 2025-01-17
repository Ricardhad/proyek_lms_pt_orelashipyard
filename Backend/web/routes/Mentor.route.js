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
const mentor = require('../models/Mentor');




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
// Endpoint to get AnakMagang and UserData using courseID
// router.get('/:courseID/AnakMagang', async (req, res) => {
//     const { courseID } = req.params;
  
//     try {
//       // Find AnakMagang documents with the specified courseID and populate the userID
//       const anakMagangList = await AnakMagang.find({ courseID })
//         .populate('userID') // Populate the UserData associated with each AnakMagang
//         .exec();
  
//       if (!anakMagangList.length) {
//         return res.status(404).json({ message: 'No AnakMagang found for this course' });
//       }
  
//       res.status(200).json(anakMagangList);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'An error occurred while retrieving data' });
//     }
//   });

// router.get('/:courseID/AnakMagang', async (req, res) => {
//     const { courseID } = req.params;

//     try {
//         // Fetch the course details
//         const course = await Course.findById(courseID);
//         if (!course) {
//             return res.status(404).json({ message: 'Course not found' });
//         }

//         // Find AnakMagang documents with the specified courseID and populate the userID
//         const anakMagangList = await AnakMagang.find({ courseID })
//             .populate('userID') // Populate the UserData associated with each AnakMagang
//             .exec();
        
//         if (!anakMagangList.length) {
//             return res.status(404).json({ message: 'No AnakMagang found for this course' });
//         }

//         // Map the AnakMagang list to include course details
//         const response = anakMagangList.map(anakMagang => ({
//             ...anakMagang.toObject(), // Convert to plain object
//             course: {
//                 id: course._id,
//                 namaCourse: course.namaCourse,
//                 deskripsi: course.Deskripsi,
//                 mentorID: course.mentorID
//             }
//         }));

//         // Send the response including AnakMagang details with course info
//         res.status(200).json({
//             anakMagang: response
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'An error occurred while retrieving data' });
//     }
// });

router.get('/:courseID/AnakMagang', async (req, res) => {
    const { courseID } = req.params;
    const { namaUser } = req.query;

    console.log("Course ID:", courseID);
    console.log("Nama User:", namaUser);

    try {
        // Fetch the course details
        const course = await Course.findById(courseID);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Build the query object
        let query = { courseID }; // Start with courseID condition

        // If namaUser is provided, add it to the query
        if (namaUser) {
            query.userID = await UserData.findOne({ namaUser: { $regex: namaUser, $options: 'i' } }).select('_id');
            if (!query.userID) {
                return res.status(200).json({ anakMagang: [] }); // No user found
            }
        }

        // Find AnakMagang documents with the specified query and populate the userID
        const anakMagangList = await AnakMagang.find(query)
            .populate('userID') // Populate the UserData associated with each AnakMagang
            .exec();

        if (!anakMagangList.length) {
            return res.status(200).json({ anakMagang: [] }); // Return empty array instead
        }

        // Map the response to include course details
        const response = anakMagangList.map(anakMagang => ({
            ...anakMagang.toObject(), // Convert to plain object
            course: {
                id: course._id,
                namaCourse: course.namaCourse,
                deskripsi: course.Deskripsi,
                mentorID: course.mentorID
            }
        }));

        // Send the response including AnakMagang details with course info
        res.status(200).json({ anakMagang: response });
    } catch (error) {
        console.error("Error fetching AnakMagang:", error);
        res.status(500).json({ error : 'An error occurred while retrieving data' });
    }
});
// Get AnakMagang by ID
// backend/routes/mentorRoutes.js
router.get('/:id/anakMagangProfile', async (req, res) => {
    try {
      // Find anakMagang and populate userID and courseID
      const anakMagang = await AnakMagang.findById(req.params.id)
        .populate('userID') // Populate user details
        .populate({
          path: 'courseID', // Populate courseID
          model: 'Course',
        });
  
      if (!anakMagang) {
        return res.status(404).json({ message: 'AnakMagang not found' });
      }
  
      // Prepare the response
      res.status(200).json(anakMagang);
    } catch (error) {
      console.error('Server error:', error);
      res.status(500).json({ message: error.message });
    }
  });
  
//   router.get('/:anakMagangID/anakMagangProfile', async (req, res) => {
//     const { anakMagangID } = req.params;
  
//     try {
//       // Find the anakMagang record by anakMagangID
//       const anakMagang = await AnakMagang.findById(anakMagangID);
//       if (!anakMagang) {
//         return res.status(404).json({ error: 'AnakMagang not found' });
//       }
  
//       // Find the user associated with the anakMagang
//       const user = await UserData.findById(anakMagang.userID);
//       if (!user) {
//         return res.status(404).json({ error: 'User not found' });
//       }
  
//       // Prepare course data associated with the anakMagang
//       const courses = await Course.find({ _id: { $in: anakMagang.courseID } });
  
//       // Find nilaiModul records associated with the anakMagang ID
//       const nilaiModuls = await NilaiModul.find({ anakMagangID: anakMagang._id })
//         .populate({
//           path: 'modulID',
//           model: 'Modul',
//         })
//         .populate({
//           path: 'mentorID',
//           model: 'Mentor',
//           populate: {
//             path: 'userID',
//             model: 'UserData', // Populate userID inside MentorSchema
//           },
//         });
  
//       // Log the populated data for debugging
//       console.log('Populated nilaiModuls:', nilaiModuls);
  
//       // Prepare the response data
//       const responseData = {
//         user,
//         anakMagang,
//         courses: courses || [], // Include courses if found, otherwise empty array
//         nilaiModuls: nilaiModuls || [], // Include nilaiModul data if found, otherwise empty array
//       };
  
//       res.status(200).json(responseData);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'An error occurred while retrieving data' });
//     }
//   });
  
  

  
router.get('/:userID/Profile', async (req, res) => {
    const { userID } = req.params;
  
    try {
      // Find the user by userID
      const user = await UserData.findById(userID);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Find the mentor associated with the userID
      const mentor = await Mentor.findOne({ userID: user._id });
      
      // Prepare course data if mentor exists
      let courses = [];
      if (mentor) {
        courses = await Course.find({ _id: { $in: mentor.courseID } });
      }
  
      // Prepare the response data
      const responseData = {
        user,
        mentor: mentor || null, // Include mentor data if found, otherwise null
        courses: courses || [], // Include courses if found, otherwise empty array
      };
  
      res.status(200).json(responseData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while retrieving data' });
    }
  });

  // Endpoint to get all NilaiModul by modulID
/**
 * GET /api/nilai-modul/:modulID
 * Endpoint to fetch all NilaiModul by modulID
 */

router.get('/nilai-modul/:modulID', async (req, res) => {
    const { modulID } = req.params;

    try {
        // Fetch NilaiModul entries with the given modulID and populate references
        const nilaiModuls = await NilaiModul.find({ modulID })
            .populate({
                path: 'modulID',
                select: 'namaModul Deskripsi Deadline gambar Dinilai', // Fields to include from Modul schema
            })
            .populate({
                path: 'anakMagangID',
                populate: {
                    path: 'userID',
                    select: 'namaUser email noTelpon Profile_Picture', // Fields from UserData schema
                },
            });

        // Check if entries are found
        if (!nilaiModuls || nilaiModuls.length === 0) {
            return res.status(404).json({ message: 'No records found for the given modulID' });
        }

        // Extract additional Modul details
        const modulDetails = await Modul.findById(modulID).select('namaModul Deskripsi Deadline gambar Dinilai');

        // Send the response
        res.status(200).json({
            success: true,
            modulDetails, // Modul schema details
            data: nilaiModuls, // NilaiModul entries with populated references
        });
    } catch (error) {
        console.error('Error fetching NilaiModul:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching NilaiModul',
        });
    }
});


// router.get('/nilai-modul/:modulID', async (req, res) => {
//     const { modulID } = req.params;

//     try {
//         // Fetch NilaiModul entries with the given modulID and populate references
//         const nilaiModuls = await NilaiModul.find({ modulID })
//             .populate({
//                 path: 'modulID',
//                 select: 'namaModul Deskripsi Deadline gambar ', // Fields to include from Modul schema
//             })
//             .populate({
//                 path: 'anakMagangID',
//                 populate: {
//                     path: 'userID',
//                     select: 'namaUser email noTelpon Profile_Picture', // Fields from UserData schema
//                 },
//             });

//         // Check if entries are found
//         if (!nilaiModuls || nilaiModuls.length === 0) {
//             return res.status(404).json({ message: 'No records found for the given modulID' });
//         }

//         // Send the response
//         res.status(200).json({
//             success: true,
//             data: nilaiModuls,
//         });
//     } catch (error) {
//         console.error('Error fetching NilaiModul:', error);
//         res.status(500).json({
//             success: false,
//             message: 'An error occurred while fetching NilaiModul',
//         });
//     }
// });


  // Get all JawabanModul by modulID
  router.get('/jawaban-modul/:modulID/:anakMagangID', async (req, res) => {
    const { modulID, anakMagangID } = req.params;

    try {
        // Validate modulID and anakMagangID
        if (!modulID || !anakMagangID) {
            return res.status(400).json({ message: 'Both modulID and anakMagangID are required.' });
        }

        // Find all JawabanModul with the specified modulID and anakMagangID
        const jawabanList = await JawabanModul.find({ modulID, anakMagangID })
            .populate('courseID', 'name') // Populate courseID field with the 'name'
            .populate({
                path: 'anakMagangID',
                populate: {
                    path: 'userID',
                    model: 'UserData', // Populates userID from the UserData schema
                    select: 'namaUser Profile_Picture email', // Only include specific fields
                },
            })
            .populate({
                path: 'soalModulID',
                model: 'SoalModul', // Populate soalModulID using the SoalModul schema
                select: 'Soal Gambar SoalType Pilihan kunciJawaban nilai', // Include specific fields
            })
            .exec();

        // If no records are found
        if (!jawabanList.length) {
            return res.status(404).json({ message: 'No answers found for the provided modulID and anakMagangID.' });
        }

        // Return the list of answers
        res.status(200).json({
            message: 'JawabanModul records retrieved successfully.',
            data: jawabanList,
        });
    } catch (error) {
        console.error('Error fetching JawabanModul:', error);
        res.status(500).json({
            message: 'An error occurred while retrieving JawabanModul records.',
            error: error.message,
        });
    }
});


//router.post('/form', upload.single('file'), async (req, res) => {
// Route to handle form submission
router.post('/form', async (req, res) => {
    const { courseID, mentorID, namaModul, Deskripsi, Deadline, soalModul } = req.body;
    // const file  = req.file
    // ? {
    //     fileName: req.file.filename,
    //     filePath: AnnouncementDir,
    //     fileType: req.file.mimetype,
    //     uploadDate: new Date(),
    // }
    // : null;
    
    try {
      // Validate course and mentor
      const course = await Course.findById(courseID);
      const mentor = await Mentor.findById(mentorID);
  
      if (!course || !mentor) {
        return res.status(404).json({ message: 'Course or Mentor not found' });
      }
  
      // Create the Modul
      const newModul = new Modul({
        courseID,
        mentorID,
        namaModul,
        Deskripsi,
        Deadline,
        Dinilai: false, // Default to false
      });
  
      // Save the Modul
      const savedModul = await newModul.save();
  
      // Create SoalModul entries
      if (soalModul && soalModul.length > 0) {
        for (const soal of soalModul) {
          const newSoalModul = new SoalModul({
            namaSoal: soal.namaSoal,
            Deskripsi: soal.Deskripsi,
            Gambar: soal.Gambar,
            SoalType: soal.SoalType,
            Pilihan: soal.Pilihan,
            kunciJawaban: soal.kunciJawaban,
          });
  
          const savedSoalModul = await newSoalModul.save();
  
          // Add the SoalModul ID to the Modul
          savedModul.soalID.push(savedSoalModul._id);
        }
  
        // Save the updated Modul with SoalModul IDs
        await savedModul.save();
      }
  
      res.status(201).json({ message: 'Modul and SoalModul created successfully', modul: savedModul });
    } catch (error) {
      res.status(500).json({ message: 'Error creating Modul and SoalModul', error: error.message });
    }
  });

  router.post('/createmodul', async (req, res) => {
    try {
      const { courseID, mentorID, gambar, namaModul, Deskripsi, Deadline, soalID, absensiID, Dinilai } = req.body;
  
      // Validate if the course and mentor exist
    //   const course = await Course.findById(courseID);
    //   const mentor = await Mentor.findById(mentorID);
    //   if (!course || !mentor) {
    //     return res.status(400).json({ message: 'Course or Mentor not found' });
    //   }
  
      // Create a new Modul
      const newModul = new Modul({
        courseID,
        mentorID,
        gambar,
        namaModul,
        Deskripsi,
        Deadline,
        soalID,
        absensiID,
        Dinilai,
      });
  
      // Save the Modul to the database
      await newModul.save();
  
      res.status(201).json({ message: 'Modul created successfully', modul: newModul });
    } catch (error) {
      console.error('Error creating Modul:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  router.post('/materials/attendance', async (req, res) => {
    try {
      const { courseID, modulID, absensiKelas } = req.body;
  
      // Log the incoming request payload
      console.log('Received attendance data:', req.body);
  
      // Validate if the module exists and belongs to the course
      const modul = await Modul.findOne({ _id: modulID, courseID });
      if (!modul) {
        console.error('Module not found or does not belong to the course');
        return res.status(400).json({ message: 'Module not found or does not belong to the course' });
      }
  
      // Log the module data
      console.log('Module found:', modul);
  
      // Create a new Absensi document
      const newAbsensi = new Absensi({
        courseID,
        modulID,
        absensiKelas: absensiKelas.map((attendance) => ({
          anakMagangID: attendance.anakMagangID,
          isPresent: attendance.isPresent,
        })),
      });
  
      // Log the new Absensi document
      console.log('New Absensi document:', newAbsensi);
  
      // Save the Absensi document
      await newAbsensi.save();
  
      // Log the saved Absensi document
      console.log('Absensi document saved:', newAbsensi);
  
      // Update the AnakMagang documents with the new Absensi ID
      for (const attendance of absensiKelas) {
        await AnakMagang.findByIdAndUpdate(attendance.anakMagangID, {
          $push: { absensiKelas: newAbsensi._id },
        });
      }
  
      // Log the updated AnakMagang documents
      console.log('AnakMagang documents updated');
  
      // Update the Modul document with the new Absensi ID
      await Modul.findByIdAndUpdate(modulID, {
        $set: { absensiID: newAbsensi._id },
      });
  
      // Log the updated Modul document
      console.log('Modul document updated');
  
      res.status(201).json({ message: 'Attendance submitted successfully', absensi: newAbsensi });
    } catch (error) {
      console.error('Error submitting attendance:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  });
  
  router.post('/addquestions', async (req, res) => {
    try {
      const { modulID, questions } = req.body;
  
      // Validate if the module exists
      const modul = await Modul.findById(modulID);
      if (!modul) {
        return res.status(400).json({ message: 'Module not found' });
      }
  
      // Create and save the questions
      const savedQuestions = await Promise.all(
        questions.map(async (question) => {
          const newQuestion = new SoalModul({
            Soal: question.question,
            SoalType: question.type === 'essay' ? 1 : 0, // 1 for essay, 0 for multiple choice
            Pilihan: question.options || [], // For multiple-choice questions
            kunciJawaban: question.answer || '', // For multiple-choice questions
            nilai: question.score || 0,
          });
          return await newQuestion.save();
        })
      );
  
      // Update the module with the new questions
      const questionIDs = savedQuestions.map((q) => q._id);
      await Modul.findByIdAndUpdate(modulID, {
        $push: { soalID: { $each: questionIDs } },
      });
  
      res.status(201).json({ message: 'Questions added successfully', questions: savedQuestions });
    } catch (error) {
      console.error('Error adding questions:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  });

  router.get('/modul/:courseID', async (req, res) => {
    try {
        const { courseID } = req.params;

        const modulList = await Modul.find({ courseID })
            .populate('soalID', 'soal pertanyaan')
            .populate({
                path: 'absensiID',
                model: 'Absensi',
                populate: {
                    path: 'absensiKelas.anakMagangID',
                    model: 'AnakMagang',
                },
            })
            .populate({
                path: 'mentorID',
                model: 'UserData',
            });

        // if (!modulList || modulList.length === 0) {
        //     return res.status(200).json({ message: 'No modul found for the given courseID' });
        // }

        res.status(200).json({ modulList });
    } catch (error) {
        console.error('Error fetching modul:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});
  
router.put('/:modulID/:anakMagangID/submit-check', async (req, res) => {
    const { modulID, anakMagangID } = req.params;
    const { mentorID, incrementValue } = req.body;

    try {
        // Find the specific NilaiModul document
        const nilaiModul = await NilaiModul.findOne({ modulID, anakMagangID });

        if (!nilaiModul) {
            return res.status(404).json({ message: 'NilaiModul not found.' });
        }

        // Check if mentorID is already set
        if (nilaiModul.mentorID) {
            return res.status(400).json({ message: 'MentorID is already set and cannot be updated.' });
        }

        // Update the mentorID and increment the nilai
        nilaiModul.mentorID = mentorID;
        nilaiModul.nilai += incrementValue;

        // Save the updated document
        await nilaiModul.save();

        return res.status(200).json({ message: 'NilaiModul updated successfully.', data: nilaiModul });
    } catch (error) {
        console.error('Error updating NilaiModul:', error);
        return res.status(500).json({ message: 'An error occurred while updating NilaiModul.', error });
    }
});

// router.get('/modul/:courseID', async (req, res) => {
//   try {
//     const { courseID } = req.params;

//     // Find all modul documents with the given courseID
//     const modulList = await Modul.find({ courseID })
//       .populate({
//         path: 'soalID', // Populate the soalID array
//         model: 'SoalModul', // Reference the SoalModul model
//       })
//       .populate({
//         path: 'absensiID', // Populate the absensiID field
//         model: 'Absensi', // Reference the Absensi model
//         populate: {
//           path: 'absensiKelas.anakMagangID', // Populate the anakMagangID field inside absensiKelas
//           model: 'AnakMagang', // Reference the AnakMagang model
//         },
//       }) 
    
//       .exec();

//     // If no modul is found, return a 404 error
//     if (!modulList || modulList.length === 0) {
//       return res.status(404).json({ message: 'No modul found for the given courseID' });
//     }

//     // Return the modul list with populated soalModul and absensi
//     res.status(200).json({ modulList });
//   } catch (error) {
//     console.error('Error fetching modul:', error);
//     res.status(500).json({ message: 'Internal server error', error: error.message });
//   }
// });

// Endpoint untuk mendapatkan absensi berdasarkan modulId
router.get('/:modulId/attendance', async (req, res) => {
    const { modulId } = req.params;

    // Validasi apakah modulId adalah ObjectId yang valid
    if (!mongoose.Types.ObjectId.isValid(modulId)) {
        return res.status(400).json({ message: "Invalid modulId parameter." });
    }

    try {
        // Query Absensi dengan populate pada courseID, absensiKelas.anakMagangID, dan userID
        const absensi = await Absensi.find({ modulID: modulId })
            .populate({
                path: 'courseID', // Populate courseID
                model: 'Course'
            })
            .populate({
                path: 'absensiKelas.anakMagangID', // Populate anakMagangID
                model: 'AnakMagang',
                populate: {
                    path: 'userID', // Populate userID dari AnakMagang
                    model: 'UserData'
                },
                
            })
            .populate({
                path: 'absensiKelas.anakMagangID', // Populate anakMagangID
                model: 'AnakMagang',
                populate: {
                    path: 'courseID', // Populate userID dari AnakMagang
                    model: 'Course'
                },
                
            })
            .populate({
                path: 'modulID', // Populate courseID
                model: 'Modul'
            });
            

        if (!absensi || absensi.length === 0) {
            return res.status(404).json({ message: "Absensi tidak ditemukan untuk modul ini." });
        }

        return res.status(200).json(absensi);
    } catch (error) {
        console.error("Error fetching attendance:", error);
        return res.status(500).json({ message: "Terjadi kesalahan saat mengambil data absensi." });
    }
});

  router.get('/nilai-modul/:modulID', async (req, res) => {
    const { modulID } = req.params;

    try {
        // Fetch NilaiModul entries with the given modulID and populate references
        const nilaiModuls = await NilaiModul.find({ modulID })
            .populate({
                path: 'modulID',
                select: 'namaModul Deskripsi Deadline gambar Dinilai', // Fields to include from Modul schema
            })
            .populate({
                path: 'anakMagangID',
                populate: {
                    path: 'userID',
                    select: 'namaUser email noTelpon Profile_Picture', // Fields from UserData schema
                },
            });

        // Check if entries are found
        if (!nilaiModuls || nilaiModuls.length === 0) {
            return res.status(404).json({ message: 'No records found for the given modulID' });
        }

        // Send the response
        res.status(200).json({
            success: true,
            data: nilaiModuls,
        });
    } catch (error) {
        console.error('Error fetching NilaiModul:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching NilaiModul',
        });
    }
});


  
// router.get("/Modul",verifyToken([1]), async (req, res) => {
//     const { filter } = req.query;
//     let search;
//     if (filter) {
//         search = await Modul.find({ namaModul: { $regex: filter, $options: 'i' } });
//         if (search.length === 0) {
//             search = await Modul.find({ Deskripsi: { $regex: filter, $options: 'i' } });
//         }
//     } else {
//         search = await Modul.find();
//     }
//     if (search.length === 0) {
//         return res.status(404).json({ message: "No results found" });
//     }
//     return res.status(200).json(search);
// })

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

// router.post("/Modul",verifyToken([1]), async (req, res) => {
//     const { name, desc, courseID, soalID, deadline } = req.body;

//     // Joi validation schema
//     const schema = Joi.object({
//         name: Joi.string().required(),
//         desc: Joi.string().optional().allow(""),
//         courseID: Joi.string().custom(checkIdValid, "ObjectId validation").required(),
//         soalID: Joi.array().items(Joi.string()).optional(),
//         deadline: Joi.date().iso().min(new Date(Date.now() + 60 * 60 * 1000)).required()
//     });

//     // Validate request body
//     const { error } = schema.validate({ ...req.body });
//     if (error) {
//         return res.status(400).json({ message: error.details[0].message });
//     }
//     try {
//         // Validate daftarKelas if provided
//         let soalIDs
//         if (soalID && soalID != []) {
//             soalIDs = validateArrayOfIDs(Modul, soalID, "Modul");
//         }
//         const findCourse = await Course.findById(courseID)
//         if (!findCourse) { return res.status(404).json({ message: "course not found" }) }
//         // Create new course
//         const newModul = new Modul({
//             namaModul: name,
//             Deskripsi: desc,
//             courseID: findCourse,
//             soalID: soalIDs || [],
//             Deadline: deadline,
//             Dinilai: false,
//         });
//         const savedModul = await newModul.save();
//         // Send success response
//         res.status(201).json(savedModul);
//     } catch (err) {
//         console.error("Error creating course:", err);
//         res.status(500).json({ message: "Internal server error" });
//     }
// });


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
