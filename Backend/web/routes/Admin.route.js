const express = require('express')
const router = express()
const mongoose = require('mongoose');

const { 
  Course,Mentor,Admin,UserData,AnakMagang,
  Modul,JawabanModul,SoalModul,NilaiModul,
  validateArrayOfIDs,checkIdValid
} =require("./functions");

const Joi = require('joi');


router.get('/', async (req, res) => {
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

// Schema validasi untuk menambahkan course
const courseValidationSchema = Joi.object({
  namaCourse: Joi.string().required(),
  Deskripsi: Joi.string().optional().allow(""),
  mentorID: Joi.array().items(Joi.string()).optional(),
});


//rey tambahkan course
// Endpoint untuk mengambil semua course
router.get("/courses", async (req, res) => {
  try {
    const courses = await Course.aggregate([
      {
        $lookup: {
          from: "mentors", // Koleksi Mentor
          localField: "mentorID",
          foreignField: "_id",
          as: "mentors",
        },
      },
      { $unwind: { path: "$mentors", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "userdatas", // Koleksi UserData
          localField: "mentors.userID",
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

router.put('/:userId/verify', async (req, res) => {
  const { userId } = req.params;
  const { isVerified } = req.body; // Pastikan ini boolean


  //   console.log(token)

  if (typeof isVerified !== 'boolean') {
    return res.status(400).json({ message: 'isVerified must be a boolean.' });
  }

  // Update user with the boolean value
  try {
    const updatedUser = await UserData.findByIdAndUpdate(
      userId,
      { isVerified },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Error updating verification:", err);
    res.status(500).json({ message: "Error updating verification status." });
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


router.put("/:anakMagangId/anakMagang", async (req, res) => {
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


router.put("/:MentorId/Mentor", async (req, res) => {
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

router.put("/:courseId/Course", async (req, res) => {
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

router.post("/Course", async (req, res) => {
  const { name, desc, MentorID, daftarKelas } = req.body;

  // Joi validation schema
  const schema = Joi.object({
    name: Joi.string().required(),
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
    let daftarMentor
    if (MentorID) {
       daftarMentor= await validateArrayOfIDs(Mentor,MentorID,"Mentor")
    }
    // Create new course
    const newCourse = new Course({
      namaCourse: name,
      Deskripsi: desc,
      mentorID: daftarMentor || [],
      daftarKelas: daftarCourse || [],
    });

    const savedCourse = await newCourse.save();

    // Send success response
    res.status(201).json(savedCourse);
  } catch (err) {
    console.error("Error creating course:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/anakMagang", async (req, res) => {
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

router.get("/Mentor", async (req, res) => {
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

        const results = await Mentor.aggregate(pipeline);

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


//======================= Anouncement =======================



// GET: Mengambil semua pengumuman
router.get("/announcements", async (req, res) => {
  try {
    const adminData = await Admin.findOne();
    if (!adminData || !adminData.announcements) {
      return res.status(404).json({ message: "No announcements found" });
    }
    res.status(200).json(adminData.announcements);
  } catch (error) {
    console.error("Error fetching announcements:", error.message); // Log pesan error
    console.error(error.stack); // Log stack trace
    res.status(500).json({ message: "Server error" });
  }
});


// POST: Menambahkan pengumuman baru
router.post('/announcements', async (req, res) => {
  const { title, description, createdBy } = req.body;

  // Validasi input
  if (!title || !description || !createdBy) {
    return res.status(400).json({ message: 'Title, description, and createdBy are required.' });
  }

  try {
    // Verifikasi apakah user dengan ID `createdBy` ada
    const user = await UserData.findById(createdBy);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    
    console.log("User found:", user); // Untuk debugging

    // Temukan admin yang terkait dengan user dan tambahkan pengumuman ke array announcements
    let admin = await Admin.findOne({ 'userID': createdBy });

    if (!admin) {
      // Jika admin tidak ditemukan, kita buat entri admin baru
      console.log("Admin not found, creating new admin entry...");

      admin = new Admin({
        userID: createdBy,
        announcements: [],  // Array pengumuman kosong di awal
        calenderPicture: {} // Ganti dengan info gambar jika diperlukan
      });

      await admin.save(); // Simpan entri admin baru
      console.log("New admin created:", admin);
    }

    // Membuat pengumuman baru
    const newAnnouncement = {
      title,
      description,
      createdBy,
      date: new Date(),
    };

    // Tambahkan pengumuman ke array announcements di admin
    admin.announcements.push(newAnnouncement);
    await admin.save(); // Simpan perubahan di database

    res.status(201).json({ message: 'Announcement created successfully!', announcement: newAnnouncement });
  } catch (error) {
    console.error('Error adding announcement:', error);
    res.status(500).json({ message: 'An error occurred while adding the announcement.' });
  }
});



// PUT: Mengedit pengumuman
router.put('/announcements/:announcementId', async (req, res) => {
  const { announcementId } = req.params;
  const { title, description } = req.body;

  // Validasi input
  const { error } = announcementValidationSchema.validate({ title, description });
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const admin = await Admin.findOneAndUpdate(
      { "announcements._id": announcementId },
      {
        $set: {
          "announcements.$.title": title,
          "announcements.$.description": description,
        },
      },
      { new: true }
    );

    if (!admin) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    res.status(200).json({ message: "Announcement updated successfully" });
  } catch (error) {
    console.error("Error updating announcement:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE: Menghapus pengumuman
router.delete('/announcements/:announcementId', async (req, res) => {
  const { announcementId } = req.params;

  try {
    const admin = await Admin.findOneAndUpdate(
      { "announcements._id": announcementId },
      {
        $pull: { announcements: { _id: announcementId } },
      },
      { new: true }
    );

    if (!admin) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    res.status(200).json({ message: "Announcement deleted successfully" });
  } catch (error) {
    console.error("Error deleting announcement:", error);
    res.status(500).json({ message: "Server error" });
  }
});




module.exports = router;
