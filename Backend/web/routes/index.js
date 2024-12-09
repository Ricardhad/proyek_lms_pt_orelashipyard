const customersRouter = require('./customers.route')
const standsRouter = require('./stands.route')
const transactionsRouter = require('./transactions.route')
const express = require('express')

const router = express()

router.use('/customers', customersRouter)
router.use('/stands', standsRouter)
router.use('/transactions', transactionsRouter)

module.exports= router;