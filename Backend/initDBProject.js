// use projectFPW

// const ObjectId = require('mongodb').ObjectId;

// Insert dummy UserData with manually assigned _id

db.UserData.insertMany([
  {
    _id: ObjectId("605c72ef1532073d1b2c3b9a"),
    namaUser: "John Doe",
    Profile_Picture: "http://example.com/profile1.jpg",
    roleType: 0,
    noTelpon: "1234567890",
    email: "johndoe@example.com",
    password: "$2b$12$KHCw7YNdbTDPcPK0Ip/j.OKd8uAaSDXbS20ZTVeb8vsZ52t6TUfnK", // "securepassword123",
    isVerified: true,
  },
  {
    _id: ObjectId("605c72ef1532073d1b2c3b9b"),
    namaUser: "Jane Smith",
    Profile_Picture: "http://example.com/profile2.jpg",
    roleType: 1,
    noTelpon: "2345678901",
    email: "janesmith@example.com",
    password: "$2b$12$rP83GO14CPqOWI7lMZGhI.KOlEY1cVgNdLBEzg0iwBjpaliTSULNq", // "password123",
  },
  {
    _id: ObjectId("605c72ef1532073d1b2c3b9c"),
    namaUser: "Mikhael",
    Profile_Picture: "http://example.com/mikhael.jpg",
    roleType: 2,
    noTelpon: "3456789012",
    email: "mikhael@example.com",
    password: "$2b$12$N3lVqyAEjjiQi1iCwpQP8eY55wdBhG85ufSS9jxS2OstLHNVR1846", //  "password456",
    isVerified: false,
  },
  {
    _id: ObjectId("605c72ef1532073d1b2c3b9d"),
    namaUser: "Enrico",
    Profile_Picture: "http://example.com/enrico.jpg",
    roleType: 1,
    noTelpon: "4567890123",
    email: "enrico@example.com",
    password: "$2b$12$F6x3lUFAVGhTQ3n/fqzSz.gVz6lnx/uD2bsjo5MJ1Kq96apoztQci", // "password789"
    isVerified: true,
  }
]);


const dummyUserID = new ObjectId("605c72ef1532073d1b2c3b9c"); 
const dummyCourseID = new ObjectId("605c72ef1532073d1b2c3c1a"); 

// # // Insert dummy AnakMagang with consistent references
db.AnakMagang.insertOne({
  AsalSekolah: "SMK Informatika",   
  courseID: dummyCourseID,  
  userID: dummyUserID,      
  absensiKelas: [               
    new Date("2024-12-01"),
    new Date("2024-12-02"),
    new Date("2024-12-03")
  ]
});

// # // Insert dummy Course data with consistent references
db.Course.insertMany([
    {
        _id: new ObjectId("605c72ef1532073d1b2c3c1a"), 
        namaCourse: "Web Development",
        Deskripsi: "Learn how to build websites from scratch",
        mentorID: [new ObjectId("605c72ef1532073d1b2c3b9a")], 
        daftarKelas: [dummyUserID] 
    },
    {
        _id: new ObjectId("605c72ef1532073d1b2c3c1b"), // Dummy ID 2
        namaCourse: "Data Science",
        Deskripsi: "Introduction to Data Science and Machine Learning",
        mentorID: [new ObjectId("605c72ef1532073d1b2c3b9b")],
        daftarKelas: [dummyUserID] 
    },
    {
        _id: new ObjectId("605c72ef1532073d1b2c3c1c"), 
        namaCourse: "Digital Marketing",
        Deskripsi: "Master Digital Marketing Strategies",
        mentorID: [new ObjectId("605c72ef1532073d1b2c3b9c")], 
        daftarKelas: [new ObjectId("605c72ef1532073d1b2c3b9d")] 
    },
    {
        _id: new ObjectId("605c72ef1532073d1b2c3c1d"),
        namaCourse: "Graphic Design",
        Deskripsi: "Learn Graphic Design from scratch",
        mentorID: [new ObjectId("605c72ef1532073d1b2c3b9d")], 
        daftarKelas: [dummyUserID] 
    }
]);
