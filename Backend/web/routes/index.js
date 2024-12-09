const customersRouter = require('./customers.route')
const standsRouter = require('./stands.route')
const transactionsRouter = require('./transactions.route')

const userDataRouter = require('./userData.route')
const express = require('express')
const router = express()

// router.use('/customers', customersRouter)
// router.use('/stands', standsRouter)
// router.use('/transactions', transactionsRouter)
router.use('/user', userDataRouter)

module.exports= router;