const express = require('express')
const router = express()

const Stand = require('../models/Stand')

router.get('/', async (req, res) => {
    const result = await Stand.find()
        .sort({ name: 1 }); // setelah melakukan find, kita dapat melakukan sorting;
    if(!result) return res.status(400).send("Error")
    return res.status(200).json(result)
})

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const result = await Stand
        .findOne({ _id: id })
    if(!result) return res.status(404).send("No data found")
    return res.status(200).json(result)
})

router.get('/:id/catalog', async (req, res) => {
    const { id } = req.params;
    const result = await Stand.findOne({ _id: id })
        .select({                                       //Select digunakan mirip seperti projection, hanya saja menerima nilai boolean
            name:  true,
            items: true,
            _id: false
        }).exec();                                     // Gunakan exec untuk mengeksekusi perubahan
    if(!result) return res.status(404).send("No data found")
    return res.status(200).json(result)
})

router.post('/', async (req, res) => {
    let { name, owner, items } = req.body;
    if(!Array.isArray(items)) items = items.split(',')
    const newStand = new Stand({
        name, owner, items
    })
    const result = await newStand.save()
    return res.status(201).json(result)
})

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    let { name, owner, items } = req.body
    if(!Array.isArray(items)) items = items.split(',')
    let result = await Stand.updateOne({
        _id: id
    },{
        $set: {
            name, owner, items
        }
    });
    if(result.modifiedCount == 0){
        return res.status(400).json({
            message: "No updated data"
        })
    }
    result = await Stand.find({
        _id: id
    })
    return res.status(200).json(result)
})

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    let result = await Stand.findOne({
        _id: id
    });
    if(!result) return res.status(404).send("No data found")
    let deletedData = result
    result = await Stand.deleteOne({
        _id: id
    });
    if(!result) return res.status(404).json({
        message: "No updated data"
    })
    return res.status(200).json(deletedData)
})

module.exports= router;