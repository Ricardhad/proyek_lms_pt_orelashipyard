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
            return res.status(404).send("No Modul found");
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
        // Fetch the data for the given ID
        const result = await SoalModul.findById(id);
        
        // Check if the result exists
        if (!result) {
            return res.status(404).send("Soal not found");
        }

        // Check if the Gambar field exists in the result
        if (!result.Gambar || !result.Gambar.filePath) {
            return res.status(404).send("File not found in the record");
        }

        const { filePath, fileName } = result.Gambar;
        
        console.log(fileName);

        // Check if the file exists on the server
        if (fs.existsSync(filePath)) {
            // Send the file for download
            return res.download(filePath, fileName, (err) => {
                if (err) {
                    console.error("Error downloading the file:", err);
                    return res.status(500).send("Error downloading the file");
                }
            });
        } else {
            return res.status(404).send("File not found on the server");
        }

    } catch (error) {
        console.error("Error fetching data:", error);
        return res.status(500).send("Server error");
    }
});
router.get('/:id/Jawaban', async (req, res) => {
    const id = req.params.id;
    try {
        // Fetch the data for the given ID
        const result = await JawabanModul.findById(id);
        
        // Check if the result exists
        if (!result) {
            return res.status(404).send("jawaban not found");
        }

        // Check if the Gambar field exists in the result
        if (!result.uploadJawaban || !result.uploadJawaban.filePath) {
            return res.status(404).send("File not found in the record");
        }

        const { filePath, fileName } = result.uploadJawaban;
        
        console.log(fileName);

        // Check if the file exists on the server
        if (fs.existsSync(filePath)) {
            // Send the file for download
            return res.download(filePath, fileName, (err) => {
                if (err) {
                    console.error("Error downloading the file:", err);
                    return res.status(500).send("Error downloading the file");
                }
            });
        } else {
            return res.status(404).send("File not found on the server");
        }

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
