const express = require('express')
const router = express()

const Transaction = require('../models/Transaction')

router.get('/', async (req, res) => {
    //Untuk menggabungkan satu model dengan yang lainnya, dapat digunakan populate
    //Untuk melakukan populate, cukup masukan field yang menjadi key reference
    const result = await Transaction.find()
        .populate('stand_id')
        .populate('customer_id');
    if(!result) return res.status(400).send("Error")
    return res.status(200).json(result)
})

router.get('/detail/:id', async (req, res) => {
    const { id } = req.params;
    const result = await Transaction.findOne({ _id: id })
        .populate('stand_id')
        .populate('customer_id');
    if(!result) return res.status(404).send("No data found")
    return res.status(200).json(result)
})


router.post('/', async (req, res) => {
    const { 
        customer_id,
        stand_id,
        items_bought,
        total } = req.body;
    const newTransaction = new Transaction({
        customer_id,
        stand_id,
        items_bought,
        total,
    })
    const result = await newTransaction.save()
    return res.status(201).json(result)
})

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    let result = await Transaction.findOne({
        _id: id
    });
    if(!result) return res.status(404).send("No data found")
    let deletedData = result
    result = await Transaction.deleteOne({
        _id: id
    });
    if(!result) return res.status(404).json({
        message: "No updated data"
    })
    return res.status(200).json(deletedData)
})


/**
 * Kita juga dapat melakukan aggregation dengan mongoose.
 */
router.get('/report', async (req, res) => {
    const result = await Transaction.aggregate()
        .lookup({
            from: 'stands',
            localField: 'stand_id',
            foreignField: '_id',
            as: 'stand'
        })
        .project({
            total: 1,
            standName:{
                $arrayElemAt: ["$stand.name", 0]
            },
            transactionId: '$_id'
        })
        .group({ 
            _id: "$standName",
            totalIncome:{
                $sum: "$total"
            },
            totalTransaction: {
                $sum: 1
            },
            transactions: {
                $push: {
                    $concat: [
                        "localhost:3000/api/transactions/detail/",
                        { $toString: "$transactionId" }
                    ]
                }
            }
        })
        .sort({ totalIncome: -1 })
        .addFields({
            tax: {
                $multiply: ["$totalIncome", 0.1]
            }
        })
    if(!result) return res.status(404).send("No data found")
    return res.status(200).json(result)
})

module.exports= router;