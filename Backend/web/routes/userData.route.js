const express = require('express')
const router = express()

//Kita akan memanggil model yang sudah diexport, untuk digunakan kembali
const UserData = require('../models/UserData')


router.get('/', async (req, res) => {
    //Untuk melakukan pengambilan data, gunakan find.
    const result = await UserData.find();
    if(!result) return res.status(400).send("Error")
    return res.status(200).json(result)
})

module.exports= router;
