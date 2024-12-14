use projectFPW

db.UserData.insertMany([
    {
      namaUser: "John Doe",
      Profile_Picture: "http://example.com/profile1.jpg",
      roleType: 0,  
      noTelpon: "1234567890",
      email: "johndoe@example.com",
      password: "securepassword123",
      isVerified: true
    },
    {
      namaUser: "Jane Smith",
      Profile_Picture: "http://example.com/profile2.jpg",
      roleType: 1,  
      noTelpon: "2345678901",
      email: "janesmith@example.com",
      password: "password123",
      isVerified: true
    },
    {
      namaUser: "Mikhael",
      Profile_Picture: "http://example.com/mikhael.jpg",
      roleType: 2,  
      noTelpon: "3456789012",
      email: "mikhael@example.com",
      password: "password456",
      isVerified: false
    },
    {
      namaUser: "Enrico",
      Profile_Picture: "http://example.com/enrico.jpg",
      roleType: 1,  
      noTelpon: "4567890123",
      email: "enrico@example.com",
      password: "password789",
      isVerified: true
    }
]);
  