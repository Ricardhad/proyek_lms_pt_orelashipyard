const express = require('express')
const router = express()
const mongoose = require('mongoose');
const cors = require('cors');


const { 
  Course,Mentor,Admin,UserData,AnakMagang,
  Modul,JawabanModul,SoalModul,NilaiModul,
  validateArrayOfIDs,checkIdValid,
  checkDupes
} =require("./functions");

const Joi = require('joi');
const { upload,verifyToken } = require('./Middleware');
const Announcement = require('../models/Announcement');


router.get('/',verifyToken([0]), async (req, res) => {
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
          localField: "mentorID",
          foreignField: "_id",
          as: "mentors",
        },
      },
      { $unwind: { path: "$mentors", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "UserData", // Koleksi UserData
          localField: "Mentor.userID",
          foreignField: "_id",
          as: "mentorDetails",
        },
      },
      { $unwind: { path: "$mentorDetails", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          namaCourse: 1,
          Deskripsi: 1,
          mentorName: "$mentorDetails.namaUser",
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
  const updatedData = req.body; // Data user yang akan diupdate

  try {
    // Cari dan update data user berdasarkan userId
    const updatedUser = await UserData.findByIdAndUpdate(
      userId,
      updatedData,
      { new: true, runValidators: true }
    );

    // Jika user tidak ditemukan
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Error updating user data:", err);
    res.status(500).json({ message: "Error updating user data.", error: err.message });
  }
});




//rey tambahkan edit user
// Endpoint untuk edit user berdasarkan ID
router.put('/:userId/editUser', async (req, res) => {
  const { userId } = req.params;
  const { namaUser, roletype, password, noTelpon } = req.body;

  // Validasi input menggunakan Joi
  const schema = Joi.object({
    namaUser: Joi.string().optional(),
    roletype: Joi.number().integer().valid(0, 1, 2).optional(), // roletype sebagai integer
    password: Joi.string().min(6).optional(),
    noTelpon: Joi.string().pattern(/^[0-9]+$/).optional(),
  });

  // Validasi request body
  const { error } = schema.validate({ namaUser, roletype, password, noTelpon });
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    // Cari user berdasarkan ID
    const user = await UserData.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update field yang diberikan
    if (namaUser) user.namaUser = namaUser;
    if (roletype !== undefined) user.roletype = roletype; // roletype sebagai integer
    if (password) user.password = password; // Harap tambahkan hashing jika diperlukan
    if (noTelpon) user.noTelpon = noTelpon;

    // Simpan perubahan
    const updatedUser = await user.save();

    // Respon sukses
    res.status(200).json({ message: "User updated successfully", updatedUser });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Internal server error" });
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

// Endpoint untuk menambahkan user dengan roleType 1 dan isVerified true
router.post('/Mentor', async (req, res) => {
  const { namaUser, Profile_Picture, noTelpon, email, password } = req.body;

  // Cek jika semua field yang dibutuhkan ada
  if (!namaUser || !Profile_Picture || !noTelpon || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Membuat instance baru untuk UserData dengan roleType 1 dan isVerified true
    const newUser = new UserData({
      namaUser,
      Profile_Picture,
      noTelpon,
      email,
      password, // pastikan password sudah di-hash di frontend sebelum dikirim
      roleType: 1,        // Set roleType menjadi 1
      isVerified: true,   // Set isVerified menjadi true
    });

    // Simpan data user ke database
    await newUser.save();

    // Response jika berhasil
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Server error', error });
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
router.post('/announcement', verifyToken, async (req, res) => {
  const { title, description, attachments, userName } = req.body; // Ambil userName dari body request

  try {
    // Mencari user berdasarkan userName untuk mendapatkan userId
    const user = await UserData.findOne({ namaUser: userName });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Buat pengumuman dengan userId yang didapat
    const newAnnouncement = new Announcement({
      title,
      description,
      createdBy: user._id, // Menyertakan userId yang ditemukan
      attachments,
    });

    await newAnnouncement.save();
    res.status(201).json({ message: "Announcement created successfully", announcement: newAnnouncement });
  } catch (error) {
    console.error("Error creating announcement:", error);
    res.status(500).json({ message: "Failed to create announcement", error: error.message });
  }
});

module.exports = router;
