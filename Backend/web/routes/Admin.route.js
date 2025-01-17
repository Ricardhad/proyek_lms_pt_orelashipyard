const express = require('express')
const router = express()
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const bcrypt = require('bcrypt');

const { 
  Course,Mentor,Admin,UserData,AnakMagang,
  Modul,JawabanModul,SoalModul,NilaiModul,
  validateArrayOfIDs,checkIdValid,
  checkDupes,
  checkIdExist
} =require("./functions");

const Joi = require('joi');
const { upload,verifyToken, AnnouncementDir } = require('./Middleware');
const Announcement = require('../models/Announcement');
const Absensi = require('../models/Absensi');


router.get('/admin',verifyToken([0]), async (req, res) => {
  // const token = localStorage.getItem('token');
  // console.log(token)
  try {
    const result = await Admin.find();
    if (result.length === 0) {
      return res.status(404).send("No users found");
    }
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).send("Server error");
  }
});


//rey tambahkan course
// Endpoint untuk mengambil semua course
router.get("/Course", async (req, res) => {
  try {
    const courses = await Course.aggregate([
      {
        $lookup: {
          from: "Mentor", // Koleksi Mentor
          localField: "mentorID", // Menghubungkan dengan field mentorID di koleksi Course
          foreignField: "_id", // Menghubungkan dengan _id di koleksi Mentor
          as: "mentors", // Menyimpan hasil join di dalam array mentors
        },
      },
      { $unwind: { path: "$mentors", preserveNullAndEmptyArrays: true } }, // Jika ada mentor, gabungkan data
      {
        $lookup: {
          from: "UserData", // Koleksi UserData
          localField: "mentors.userID", // Menghubungkan dengan userID dari koleksi Mentor
          foreignField: "_id", // Menghubungkan dengan _id di koleksi UserData
          as: "mentorDetails", // Menyimpan hasil lookup mentorDetails
        },
      },
      { $unwind: { path: "$mentorDetails", preserveNullAndEmptyArrays: true } }, // Menggabungkan data mentorDetails
      {
        $project: {
          _id: 1,
          namaCourse: 1,
          Deskripsi: 1,
          mentorName: "$mentorDetails.namaUser", // Nama mentor
          mentorId: "$mentors._id", // Menambahkan mentorId
        },
      },
    ]);

    res.json({ courses });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});


// Aktifkan CORS hanya pada endpoint ini
router.put('/:userId', async (req, res) => { 
  const { userId } = req.params;
  const updatedData = { ...req.body, isVerified: true }; // Pastikan isVerified selalu true

  try {
    const updatedUser = await UserData.findByIdAndUpdate(
      userId,
      updatedData,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Error updating user data:", err);
    res.status(500).json({ message: "Error updating user data.", error: err.message });
  }
});


router.put('/:userId/editUser', async (req, res) => {
  const { userId } = req.params;
  const { namaUser, password, courseID, AsalSekolah, noTelpon } = req.body;

  // Validasi input menggunakan Joi
  const schema = Joi.object({
    namaUser: Joi.string().optional(),
    password: Joi.string().min(6).optional(),
    courseID: Joi.string().optional(), // courseID sebagai string (ObjectId)
    AsalSekolah: Joi.string().optional(),
    noTelpon: Joi.string().pattern(/^[0-9]+$/).optional(),
  });

  const { error } = schema.validate({ namaUser, password, courseID, AsalSekolah, noTelpon });
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    // Cari user berdasarkan ID
    const user = await UserData.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Periksa roleType
    if (user.roleType !== 2) {
      return res.status(403).json({ message: 'Invalid roleType: Must be 2 (Intern)' });
    }

    // Update data di UserData
    if (namaUser) user.namaUser = namaUser;
    if (password) user.password = password; // Tambahkan hashing jika diperlukan
    if (noTelpon) user.noTelpon = noTelpon;
    await user.save();

    // Cari data AnakMagang berdasarkan userID
    const anakMagang = await AnakMagang.findOne({ userID: userId });
    if (!anakMagang) {
      return res.status(404).json({ message: 'Intern data not found' });
    }

    // Update courseID jika diberikan
    if (courseID) {
      const course = await Course.findById(courseID);
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
      anakMagang.courseID = course._id;
    }

    // Update AsalSekolah
    if (AsalSekolah) {
      anakMagang.AsalSekolah = AsalSekolah;
    }

    // Simpan perubahan di AnakMagang
    await anakMagang.save();

    res.status(200).json({
      message: 'User and intern data updated successfully',
      updatedUser: user,
      updatedIntern: anakMagang,
    });
  } catch (err) {
    console.error('Error updating user and intern data:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});





//rey tambahkan edit user
// Endpoint untuk edit user berdasarkan ID
// router.put('/:userId/editUser', async (req, res) => {
//   const { userId } = req.params;
//   const { namaUser, roletype, password, noTelpon } = req.body;

//   // Validasi input menggunakan Joi
//   const schema = Joi.object({
//     namaUser: Joi.string().optional(),
//     roletype: Joi.number().integer().valid(0, 1, 2).optional(), // roletype sebagai integer
//     password: Joi.string().min(6).optional(),
//     noTelpon: Joi.string().pattern(/^[0-9]+$/).optional(),
//   });

//   // Validasi request body
//   const { error } = schema.validate({ namaUser, roletype, password, noTelpon });
//   if (error) {
//     return res.status(400).json({ message: error.details[0].message });
//   }

//   try {
//     // Cari user berdasarkan ID
//     const user = await UserData.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Update field yang diberikan
//     if (namaUser) user.namaUser = namaUser;
//     if (roletype !== undefined) user.roletype = roletype; // roletype sebagai integer
//     if (password) user.password = password; // Harap tambahkan hashing jika diperlukan
//     if (noTelpon) user.noTelpon = noTelpon;

//     // Simpan perubahan
//     const updatedUser = await user.save();

//     // Respon sukses
//     res.status(200).json({ message: "User updated successfully", updatedUser });
//   } catch (err) {
//     console.error("Error updating user:", err);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

router.get('/intern/:id', async (req, res) => {
  try {
    const internId = req.params.id;

    // Pastikan ID valid
    if (!mongoose.Types.ObjectId.isValid(internId)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    // Konversi ke ObjectId
    const internObjectId = new mongoose.Types.ObjectId(internId);

    // Ambil data user (Anak Magang)
    const user = await UserData.findById(internObjectId).select('namaUser Profile_Picture email noTelpon');

    if (!user) {
      return res.status(404).json({ message: 'Intern not found' });
    }

    // Cari course yang diikuti oleh intern
    const courses = await Course.find({ daftarKelas: internObjectId })
      .populate({
        path: 'mentorID',
        select: 'userID',
        populate: {
          path: 'userID',
          select: 'namaUser Profile_Picture',
        },
      })
      .select('namaCourse Deskripsi mentorID');

    // Cari absensi berdasarkan course yang diikuti
    const absensi = await Absensi.find({ absensiKelas: internObjectId })
      .populate('courseID', 'namaCourse')
      .select('tanggalAbsensi');

    // Format respons
    const response = {
      user: {
        nama: user.namaUser,
        profilePicture: user.Profile_Picture,
        email: user.email,
        noTelpon: user.noTelpon,
      },
      courses: courses.map((course) => ({
        namaCourse: course.namaCourse,
        deskripsi: course.Deskripsi,
        mentor: course.mentorID.map((mentor) => ({
          namaMentor: mentor.userID.namaUser,
          profilePicture: mentor.userID.Profile_Picture,
        })),
      })),
      absensi: absensi.map((record) => ({
        course: record.courseID.namaCourse,
        tanggal: record.tanggalAbsensi,
      })),
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});



router.put("/:anakMagangId/anakMagang",verifyToken([0]), async (req, res) => {
  const { anakMagangId } = req.params;
  const { courseID, asalSekolah } = req.body;

  console.log(anakMagangId)
  try {
    const courseExist = await Course.findById(courseID);

    const findUser = await AnakMagang.findById(anakMagangId);

    let asal = "";

    if (asalSekolah && asalSekolah.trim() !== "") {
      asal = asalSekolah;
    } else {
      asal = findUser.AsalSekolah
    }

    if (!courseExist) {
      return res.status(400).json({ message: "Course not found" });
    }

    const updatedUser = await AnakMagang.findByIdAndUpdate(
      anakMagangId,
      {
        courseID,
        AsalSekolah: asal,
      },
      { new: true }
    );

    if (!findUser) {
      return res.status(404).json({ message: "AnakMagang not found" });
    }

    if (!updatedUser) {
      return res.status(404).json({ message: "update failed" });
    }

    res.status(200).json(updatedUser);

  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put('/updateMentorCourse/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { courseId } = req.body;

    // Validasi apakah courseId ada di database
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Cari UserData berdasarkan id
    const userData = await UserData.findById(id);
    if (!userData) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Cari Mentor berdasarkan userID yang ada di UserData
    const mentor = await Mentor.findOne({ userID: userData._id });
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    // Update Mentor dengan courseId yang baru
    mentor.courseID = courseId;
    await mentor.save();

    res.status(200).json({ message: 'Mentor updated successfully', mentor });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: 'Server error', error: err });
  }
});


router.get('/mentors/:id', async (req, res) => {
  try {
    // Cari UserData berdasarkan ID
    const userData = await UserData.findById(req.params.id);
    if (!userData) {
      return res.status(404).json({ message: 'UserData not found' });
    }

    // Pastikan user adalah mentor (roleType === 1)
    if (userData.roleType !== 1) {
      return res.status(403).json({ message: 'User is not a mentor' });
    }

    // Cari Mentor berdasarkan userID yang terhubung dengan UserData
    const mentor = await Mentor.findOne({ userID: req.params.id })
      .populate('courseID'); // Populasi data course yang diambil oleh mentor

    if (!mentor) {
      return res.status(404).json({ message: 'Mentor data not found' });
    }

    // Hapus password dari data UserData sebelum dikirim
    const mentorResponse = mentor.toObject();
    delete mentorResponse.userID.password; // Hapus password dari userID

    // Kirimkan data mentor beserta course yang diambil dan data user tanpa password
    res.status(200).json({ mentor: mentorResponse });
  } catch (error) {
    console.error('Error fetching mentor data:', error);
    res.status(500).json({ message: 'Error fetching mentor data', error });
  }
});



// // Endpoint untuk mendapatkan detail user berdasarkan ID
// router.get('/detail/:id', async (req, res) => {

//   try {
//     const { id } = req.params;
//     // Mencari mentor dan populate 'courseID' dan 'userID' untuk mendapatkan data terkait
//     const mentor = await Mentor.findOne({userID:id})
//     .populate('courseID') // Memastikan 'courseID' dipopulasi untuk mengambil detail kursus
//     .populate('userID'); // Memastikan 'userID' dipopulasi untuk mengambil detail pengguna
    
//     if (!mentor) {
//       return res.status(404).json({ message: 'Mentor not found' });
//     }
//     console.log(mentor)

//     // Ambil nama-nama kursus dari courseID
//     const courseNames = mentor.courseID.length
//       ? mentor.courseID.map(course => course.namaCourse) // Ambil namaCourse dari courseID
//       : [];

//     // Ambil detail pengguna (user)
//     const userDetail = mentor.userID
//       ? {
//           namaUser: mentor.userID.namaUser,
//           email: mentor.userID.email,
//           noTelpon: mentor.userID.noTelpon,
//           profilePicture: mentor.userID.Profile_Picture,
//         }
//       : null;

//     res.status(200).json({
//       mentor,
//       courses: courseNames, // Mengirimkan daftar nama kursus
//       user: userDetail, // Mengirimkan detail user yang terkait
//     });
//   } catch (err) {
//     console.error('Error:', err);
//     res.status(500).json({ message: 'Server error', error: err });
//   }
// });
router.put("/:MentorId/Mentor",verifyToken([0]), async (req, res) => {
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

// Endpoint untuk edit mentor dan data user
router.put("/mentor/:id", async (req, res) => {
  const { id } = req.params; // ID mentor (sebenarnya ini adalah userID dari UserData)
  const { courseIDs, namaUser, password, noTelpon, Profile_Picture } = req.body;

  try {
    // Cari user berdasarkan ID (ini adalah userID, bukan mentorID)
    const user = await UserData.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Cari mentor berdasarkan userID yang terkait dengan UserData
    const mentor = await Mentor.findOne({ userID: id });
    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    // Update daftar course untuk mentor
    if (courseIDs) {
      // Pastikan courseIDs valid, hanya satu course yang diperbolehkan
      const course = await Course.findById(courseIDs);
      if (!course) {
        return res.status(400).json({ message: "Invalid courseID" });
      }

      // Update courseID pada mentor
      mentor.courseID = course._id;
      await mentor.save();

      // Update setiap course dengan mentorID baru
      await Course.updateMany(
        { mentorID: mentor._id },
        { $pull: { mentorID: mentor._id } } // Hapus mentor dari course sebelumnya
      );
      await Course.updateMany(
        { _id: course._id },
        { $addToSet: { mentorID: mentor._id } } // Tambahkan mentor ke course baru
      );
    }

    // Update data user (untuk user yang terkait dengan mentor)
    if (namaUser) user.namaUser = namaUser;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }
    if (noTelpon) user.noTelpon = noTelpon;
    if (Profile_Picture !== undefined) user.Profile_Picture = Profile_Picture;

    await user.save();

    // Respons data mentor yang telah diperbarui
    return res.status(200).json({
      message: "Mentor updated successfully",
      mentor: {
        ...mentor.toObject(),
        userData: {
          namaUser: user.namaUser,
          Profile_Picture: user.Profile_Picture,
          noTelpon: user.noTelpon,
          email: user.email,
        },
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// Endpoint untuk mengambil semua data UserData dengan roleType 1 (mentor)
router.get('/mentors', async (req, res) => {
  try {
    // Cari semua user dengan roleType 1 (mentor)
    const mentors = await UserData.find({ roleType: 1 });

    // Jika tidak ada mentor ditemukan
    if (mentors.length === 0) {
      return res.status(404).json({ message: 'No mentors found.' });
    }

    // Kirimkan data mentor yang ditemukan
    res.status(200).json({ mentors });
  } catch (error) {
    console.error('Error fetching mentors:', error);
    res.status(500).json({ message: 'Error fetching mentors.', error });
  }
});

router.get('/detailmentor/:id', async (req, res) => {

  try {
    const { id } = req.params;
    // Mencari mentor dan populate 'courseID' dan 'userID' untuk mendapatkan data terkait
    const mentor = await Mentor.findOne({userID:id})
    .populate('courseID') // Memastikan 'courseID' dipopulasi untuk mengambil detail kursus
    .populate('userID'); // Memastikan 'userID' dipopulasi untuk mengambil detail pengguna
    
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }
    // console.log(mentor)

    // Ambil nama-nama kursus dari courseID
    const courseNames = mentor.courseID.length
      ? mentor.courseID.map(course => course.namaCourse) // Ambil namaCourse dari courseID
      : [];

    // Ambil detail pengguna (user)
    const userDetail = mentor.userID
      ? {
          namaUser: mentor.userID.namaUser,
          email: mentor.userID.email,
          noTelpon: mentor.userID.noTelpon,
          profilePicture: mentor.userID.Profile_Picture,
        }
      : null;

    res.status(200).json({
      mentor,
      courses: courseNames, // Mengirimkan daftar nama kursus
      user: userDetail, // Mengirimkan detail user yang terkait
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: 'Server error', error: err });
  }
});


router.get('/detail/:id', async (req, res) => {

  try {
    const { id } = req.params;
    // Mencari mentor dan populate 'courseID' dan 'userID' untuk mendapatkan data terkait
    const mentor = await Mentor.findOne({userID:id})
    .populate('courseID') // Memastikan 'courseID' dipopulasi untuk mengambil detail kursus
    .populate('userID'); // Memastikan 'userID' dipopulasi untuk mengambil detail pengguna
    
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }
    // console.log(mentor)

    // Ambil nama-nama kursus dari courseID
    const courseNames = mentor.courseID.length
      ? mentor.courseID.map(course => course.namaCourse) // Ambil namaCourse dari courseID
      : [];

    // Ambil detail pengguna (user)
    const userDetail = mentor.userID
      ? {
          namaUser: mentor.userID.namaUser,
          email: mentor.userID.email,
          noTelpon: mentor.userID.noTelpon,
          profilePicture: mentor.userID.Profile_Picture,
        }
      : null;

    res.status(200).json({
      mentor,
      courses: courseNames, // Mengirimkan daftar nama kursus
      user: userDetail, // Mengirimkan detail user yang terkait
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: 'Server error', error: err });
  }
});

router.put("/:courseId/Course",verifyToken([0]), async (req, res) => {
  const {courseId}= req.params;
  const { name, desc, MentorID, daftarKelas } = req.body;

  // Joi validation schema
  const schema = Joi.object({
    name: Joi.string().optional(),
    desc: Joi.string().optional().allow(""),
    MentorID: Joi.array().items(Joi.string()).optional(),
    daftarKelas: Joi.array().items(Joi.string()).optional(),
  });

  // Validate request body
  const { error } = schema.validate({ name, desc, MentorID, daftarKelas });
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    // Validate daftarKelas if provided
    let daftarCourse
    if (daftarKelas) {
      daftarCourse= await validateArrayOfIDs(AnakMagang,daftarKelas,"AnakMagang")
    }
    // Check if MentorID exists\
    let daftarMentor
    if (MentorID) {
       daftarMentor= await validateArrayOfIDs(Mentor,MentorID,"Mentor")
    }
    // Create new course
    const updateCourse= await Course.findByIdAndUpdate(
      courseId,
      {
        ...(name && { namaCourse: name }), // Update name if provided
        ...(desc && { Deskripsi: desc }), // Update description if provided
        ...(daftarMentor && daftarMentor.length > 0 && { mentorID: daftarMentor }), // Update mentorID if provided and not empty
        ...(daftarCourse && daftarCourse.length > 0 && { daftarKelas: daftarCourse }), // Update daftarKelas if provided and not empty
      },
      { new: true }
    )

    if (!updateCourse) {
      return res.status(404).json({ error: "course not found" });
    }

    res.status(200).json(updateCourse);
  } catch (err) {
    console.error("Error creating course:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// router.post("/Course", async (req, res) => {
//   const { name, desc, MentorID, daftarKelas } = req.body;

//   // Joi validation schema
//   const schema = Joi.object({
//     name: Joi.string().required(),
//     desc: Joi.string().optional().allow(""),
//     MentorID: Joi.array().items(Joi.string()).optional(),
//     daftarKelas: Joi.array().items(Joi.string()).optional(),
//   });
//   const exist= checkDupes(Course,'namaCourse',name);
//   if(exist){
//     return res.status(400).json({message:"duplicate name enter new name"});
//   }

//   // Validate request body
//   const { error } = schema.validateAsync({ name, desc, MentorID, daftarKelas });
//   if (error) {
//     return res.status(400).json({ message: error.details[0].message });
//   }

//   try {
//     // Validate daftarKelas if provided
//     let daftarCourse
//     if (daftarKelas) {
//       daftarCourse= await validateArrayOfIDs(AnakMagang,daftarKelas,"AnakMagang")
//     }
//     let daftarMentor
//     if (MentorID) {
//        daftarMentor= await validateArrayOfIDs(Mentor,MentorID,"Mentor")
//     }
//     // Create new course
//     const newCourse = new Course({
//       namaCourse: name,
//       Deskripsi: desc,
//       mentorID: daftarMentor || [],
//       daftarKelas: daftarCourse || [],
//     });

//     const savedCourse = await newCourse.save();

//     // Send success response
//     res.status(201).json(savedCourse);
//   } catch (err) {
//     console.error("Error creating course:", err);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

router.post("/Course", async (req, res) => {
  try {
    // Menerima data dari request body
    const { namaCourse, Deskripsi, mentorID, daftarKelas } = req.body;

    // Membuat instance baru Course
    const newCourse = new Course({
      namaCourse,
      Deskripsi,
      mentorID: mentorID || [],  // Jika mentorID tidak diberikan, tetap mengirimkan array kosong
      daftarKelas: daftarKelas || []  // Jika daftarKelas tidak diberikan, tetap mengirimkan array kosong
    });

    // Menyimpan Course ke database
    const savedCourse = await newCourse.save();

    // Mengirimkan response dengan status 201 (Created) dan data Course yang baru disimpan
    res.status(201).json(savedCourse);
  } catch (error) {
    // Jika terjadi error, kirimkan response dengan status 500 (Internal Server Error)
    res.status(500).json({ message: "Error creating course", error });
  }
});

router.get("/anakMagang",verifyToken([0]), async (req, res) => {
    const { namaUser } = req.query;

    try {
        let pipeline = [
            {
                $lookup: {
                    from: 'UserData', // assuming the collection name for user is 'users'
                    localField: 'userID',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {$unwind: '$user'},
            {
                $match: {
                    $or: [
                        { 'user.namaUser': { $regex: new RegExp(namaUser, 'i') } },
                    ]
                }
            }
        ];

        const results = await AnakMagang.aggregate(pipeline);

        if (results.length === 0) {
            return res.status(404).json({ message: "No results found" });
        }

        return res.status(200).json(results);
    } catch (error) {
        console.error("Error fetching JawabanModul data:", error);
        return res.status(500).json({ message: "Server error" });
    }
});









// Schema untuk validasi request body
const mentorSchema = Joi.object({
  namaUser: Joi.string().required(),
  Profile_Picture: Joi.string().allow(null, ''),
  noTelpon: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  course: Joi.string().required(),
});

router.post('/Mentor', verifyToken([0]), async (req, res) => {
  try {
    // Validasi request body menggunakan Joi
    const { namaUser, Profile_Picture, noTelpon, email, password, course } = req.body;
    const { error } = mentorSchema.validate(req.body);
    if (error) {
      console.error('Validation error:', error.details[0].message);
      return res.status(400).json({ message: error.details[0].message });
    }

    // Periksa apakah email sudah terdaftar
    const existingUser = await UserData.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered.' });
    }

    // Periksa apakah course ada di database
    const courseExist = await Course.findOne({ namaCourse: course });
    if (!courseExist) {
      return res.status(400).json({ message: 'Course not found.' });
    }

    // Hash password untuk keamanan
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat objek user baru dengan isVerified = true
    const newUser = new UserData({
      namaUser,
      Profile_Picture: Profile_Picture || null,
      roleType: 1, // 1 untuk mentor
      noTelpon,
      email,
      password: hashedPassword,
      isVerified: true, // Mengatur isVerified menjadi true
    });

    // Simpan user ke database
    const savedUser = await newUser.save();

    // Buat objek mentor baru
    const newMentor = new Mentor({
      userID: savedUser._id,
      courseID: [courseExist._id], // Menggunakan ID course dari database
    });

    // Simpan mentor ke database
    const savedMentor = await newMentor.save();

    // Response jika berhasil
    res.status(201).json({
      message: 'Mentor created successfully.',
      user: savedUser,
      mentor: savedMentor,
    });
  } catch (error) {
    console.error('Error creating mentor:', error);
    res.status(500).json({ message: 'Error creating mentor.', error: error.message });
  }
});






//======================= Anouncement =======================



// GET: Mengambil semua pengumuman
router.get("/announcements", async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .populate("createdBy", "namaUser") // Mengambil data user yang membuat pengumuman
      .exec();
    res.status(200).json(announcements);
  } catch (error) {
    console.error("Error fetching announcements:", error);
    res.status(500).json({ message: "Failed to fetch announcements" });
  }
});


// // POST: Menambahkan pengumuman baru
// router.post('/announcements',verifyToken([0]), async (req, res) => {
//   const { title, description, createdBy } = req.body;

//   // Validasi input
//   if (!title || !description || !createdBy) {
//     return res.status(400).json({ message: 'Title, description, and createdBy are required.' });
//   }

//   try {
//     // Verifikasi apakah user dengan ID `createdBy` ada
//     const user = await UserData.findById(createdBy);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found.' });
//     }
    
//     console.log("User found:", user); // Untuk debugging

//     // Temukan admin yang terkait dengan user dan tambahkan pengumuman ke array announcements
//     let admin = await Admin.findOne({ 'userID': createdBy });

//     if (!admin) {
//       // Jika admin tidak ditemukan, kita buat entri admin baru
//       console.log("Admin not found, creating new admin entry...");

//       admin = new Admin({
//         userID: createdBy,
//         announcements: [],  // Array pengumuman kosong di awal
//         calenderPicture: {} // Ganti dengan info gambar jika diperlukan
//       });

//       await admin.save(); // Simpan entri admin baru
//       console.log("New admin created:", admin);
//     }

//     // Membuat pengumuman baru
//     const newAnnouncement = {
//       title,
//       description,
//       createdBy,
//       date: new Date(),
//     };

//     // Tambahkan pengumuman ke array announcements di admin
//     admin.announcements.push(newAnnouncement);
//     await admin.save(); // Simpan perubahan di database

//     res.status(201).json({ message: 'Announcement created successfully!', announcement: newAnnouncement });
//   } catch (error) {
//     console.error('Error adding announcement:', error);
//     res.status(500).json({ message: 'An error occurred while adding the announcement.' });
//   }
// });

// Konfigurasi multer untuk upload file
// POST endpoint to create a new announcement
// POST endpoint to create a new announcement
// POST endpoint to create a new announcement
router.post("/announcement", verifyToken([0]),upload.single("attachments"),  async (req, res) => {  // Use upload.array for multiple files
  try {
      const { title, description, createdBy } = req.body;
      // const { attachments } = req.files || []; // Handle multiple files

      // console.log(attachments);  // Log the attachments
      const attachments  = req.file
      ? {
          fileName: req.file.filename,
          filePath: AnnouncementDir,
          fileType: req.file.mimetype,
          uploadDate: new Date(),
      }
      : null;
      
      console.log( attachments)
      if (!attachments ) {
          return res.status(400).json({ message: "No attachments uploaded." });
      }

      // Create new Announcement document
      const newAnnouncement = new Announcement({
          title,
          description,
          createdBy,
          attachments: attachments,
          date: new Date(),
      });

      // Save the announcement to the database
      await newAnnouncement.save();

      return res.status(201).json({
          message: 'Announcement created successfully.',
          announcement: newAnnouncement,
      });
  } catch (err) {
      console.error('Error creating announcement:', err);
      res.status(500).json({
          message: 'Failed to create announcement.',
          error: err.message,
      });
  }
});


// DELETE endpoint untuk menghapus announcement
router.delete("/announcement/:id", async (req, res) => {
  try {
    const announcementId = req.params.id;
    const announcement = await Announcement.findById(announcementId);

    if (!announcement) {
      return res.status(404).json({
        message: 'Announcement tidak ditemukan'
      });
    }

    // Hapus file attachments dari storage jika ada
    if (announcement.attachments && announcement.attachments.length > 0) {
      announcement.attachments.forEach(attachment => {
        fs.unlink(attachment.filePath, (err) => {
          if (err) console.error('Error deleting file:', err);
        });
      });
    }

    await Announcement.findByIdAndDelete(announcementId);

    res.status(200).json({
      message: 'Announcement berhasil dihapus'
    });
  } catch (err) {
    console.error('Error menghapus announcement:', err);
    res.status(500).json({
      message: 'Gagal menghapus announcement',
      error: err.message
    });
  }
});

// PUT endpoint untuk mengupdate announcement
router.put("/announcement/:id", upload.fields([
  { name: 'attachments', maxCount: 5 }
]), async (req, res) => {
  try {
    const announcementId = req.params.id;
    const { title, description } = req.body;
    const newAttachments = req.files.attachments || [];

    const announcement = await Announcement.findById(announcementId);

    if (!announcement) {
      return res.status(404).json({
        message: 'Announcement tidak ditemukan'
      });
    }

    // Hapus file attachments lama jika ada attachments baru
    if (newAttachments.length > 0 && announcement.attachments.length > 0) {
      announcement.attachments.forEach(attachment => {
        fs.unlink(attachment.filePath, (err) => {
          if (err) console.error('Error deleting old file:', err);
        });
      });
    }

    const updateData = {
      title,
      description,
      updatedAt: new Date()
    };

    // Tambahkan attachments baru jika ada
    if (newAttachments.length > 0) {
      updateData.attachments = newAttachments.map(file => ({
        fileName: file.originalname,
        filePath: file.path,
        fileType: file.mimetype,
        fileSize: file.size,
        uploadDate: new Date(),
      }));
    }

    const updatedAnnouncement = await Announcement.findByIdAndUpdate(
      announcementId,
      updateData,
      { new: true }
    );

    res.status(200).json({
      message: 'Announcement berhasil diupdate',
      announcement: updatedAnnouncement
    });
  } catch (err) {
    console.error('Error mengupdate announcement:', err);
    res.status(500).json({
      message: 'Gagal mengupdate announcement',
      error: err.message
    });
  }
});

module.exports = router;
