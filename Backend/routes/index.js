const drugsRouter = require('./drugs.route')
const express = require('express')

const router = express()

router.use('/drugs', drugsRouter)
module.exports= router;