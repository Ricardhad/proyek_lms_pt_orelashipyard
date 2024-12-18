const express = require('express')
const router = express()

//Kita akan memanggil model yang sudah diexport, untuk digunakan kembali
const { JawabanModul, SoalModul , Modul } = require('./functions');
const path = require('path');
const fs = require('fs');
const {profilePictureDir,answerDir,questionDocsDir,questionPicsDir} = require('./Middleware')

router.get('/', async (req, res) => {
    try {
        const result = await Modul.find();
        if (result.length === 0) {
            return res.status(404).send("No users found");
        }
        return res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching data:", error);
        return res.status(500).send("Server error");
    }
});
router.get('/:id/Soal', async (req, res) => {
    const id = req.params.id;
    try {
        const result = await SoalModul.findById(id);
        if (result.length === 0) {
            return res.status(404).send("No Soal found found");
        }
        const type = result.Gambar.fileType;
        const fileName= result.Gambar.fileName;
        const filePath= result.Gambar.filePath;
        // _id: 676040871370885801b4208a
        // "Gambar": {
        //     "fileName": "uploadSoal-1734515678668-635367604.docx",
        //     "filePath": "C:\\Users\\richard\\OneDrive\\kuliah sem3\\nodejs(webservice)\\proyek_lms_pt_orelashipyard\\backend\\web\\uploads\\questions\\documents\\uploadSoal-1734515678668-635367604.docx",
        //     "fileType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        //     "uploadDate": "2024-12-18T09:54:38.672Z"
        // },
        console.log(fileName)
        // switch (type) {
        //     case 'answers':
        //         filePath = path.join(answerDir, fileName);
        //         break;
        //     case 'questionPics':
        //         filePath = path.join(questionPicsDir, fileName);
        //         break;
        //     case 'questionDocs':
        //         filePath = path.join(questionDocsDir, fileName);
        //         break;
        //     case 'profile':
        //         filePath = path.join(profilePictureDir, fileName);
        //         break;
        //     default:
        //         return res.status(400).json({ message: 'Invalid file type' });
        // }
        if (fs.existsSync(filePath)) {
            // Send the file for download
            res.download(filePath, fileName, (err) => {
                if (err) {
                    console.error("Error downloading the file:", err);
                    return res.status(500).send("Error downloading the file");
                }
            });
        } else {
            return res.status(404).send("File not found");
        }
        return res.status(200).json("file "+fileName+" downloaded");
    } catch (error) {
        console.error("Error fetching data:", error);
        return res.status(500).send("Server error");
    }
});
router.get('/Jawaban', async (req, res) => {
    try {
        const result = await JawabanModul.find();
        if (result.length === 0) {
            return res.status(404).send("No users found");
        }
        return res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching data:", error);
        return res.status(500).send("Server error");
    }
});

module.exports= router;
