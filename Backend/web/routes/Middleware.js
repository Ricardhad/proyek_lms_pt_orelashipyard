const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure the upload directories for answers and questions exist
const answerDir = path.join(__dirname, "../uploads/answers");
const questionDir = path.join(__dirname, "../uploads/questions");
const profilePictureDir = path.join(__dirname, "../uploads/profile");

if (!fs.existsSync(answerDir)) {
    fs.mkdirSync(answerDir, { recursive: true });
}

if (!fs.existsSync(questionDir)) {
    fs.mkdirSync(questionDir, { recursive: true });
}
if (!fs.existsSync(profilePictureDir)) {
    fs.mkdirSync(profilePictureDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Dynamically set the destination folder based on the field name
        if (file.fieldname === "uploadJawaban") {
            cb(null, answerDir); // Save answers in the 'uploads/answers' directory
        } else if (file.fieldname === "uploadSoal") {
            cb(null, questionDir); // Save questions in the 'uploads/questions' directory
        } else if (file.fieldname === "uploadProfile") {
            cb(null, profilePictureDir); // Save questions in the 'uploads/questions' directory
        } else {
            cb(new Error("Unknown fieldname, cannot determine directory."), false); // Handle unknown fieldnames
        }
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname); // Get file extension
        cb(null, file.fieldname + "-" + uniqueSuffix + ext); // Construct unique file name
    },
});

// File filter to allow only specific file types
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["application/pdf", "image/png", "image/jpeg"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // Accept the file
    } else {
        cb(new Error("Invalid file type. Only PDF, PNG, and JPEG are allowed."), false);
    }
};

// Multer instance
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
});

module.exports = { upload };
