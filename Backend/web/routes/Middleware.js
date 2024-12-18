const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure the upload directories for answers and questions exist
const answerDir = path.join(__dirname, "../uploads/answers");
const questionPicsDir = path.join(__dirname, "../uploads/questions/pictures");
const questionDocsDir = path.join(__dirname, "../uploads/questions/documents");
const profilePictureDir = path.join(__dirname, "../uploads/profile");

if (!fs.existsSync(answerDir)) {
    fs.mkdirSync(answerDir, { recursive: true });
}

if (!fs.existsSync(questionPicsDir)) {
    fs.mkdirSync(questionPicsDir, { recursive: true });
}

if (!fs.existsSync(questionDocsDir)) {
    fs.mkdirSync(questionDocsDir, { recursive: true });
}

if (!fs.existsSync(profilePictureDir)) {
    fs.mkdirSync(profilePictureDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log('Field name:', file.fieldname);
        console.log('Mime type:', file.mimetype);

        // Dynamically set the destination folder based on the field name and mime type
        if (file.fieldname === "uploadJawaban") {
            cb(null, answerDir); // Save answers in the 'uploads/answers' directory
        } else if (file.fieldname === "uploadSoal" &&
            (file.mimetype === "image/jpeg"
                || file.mimetype === "image/png"
                || file.mimetype === "image/jpg")) {
            cb(null, questionPicsDir); // Save images in 'uploads/questions/pictures' directory
        } else if (file.fieldname === "uploadSoal" &&
            (file.mimetype === "application/pdf"
                || file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
            cb(null, questionDocsDir); // Save documents in 'uploads/questions/documents' directory
        } else if (file.fieldname === "uploadProfile") {
            cb(null, profilePictureDir); // Save profile pictures in 'uploads/profile' directory
        } else {
            cb(new Error("Unknown fieldname or invalid file type, cannot determine directory."), false); // Handle unknown fieldnames or invalid file types
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
    const allowedTypes = ["application/pdf", "image/png", "image/jpeg","application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
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
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

module.exports = { upload };
