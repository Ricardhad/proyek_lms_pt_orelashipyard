
const userDataRouter = require('./userData.route')
const adminRouter = require('./userData.route')
const anakMagangRouter = require('./userData.route')
const mentorRouter = require('./userData.route')
const modulRouter = require('./userData.route')
const express = require('express')
const router = express()


router.use('/user', userDataRouter)
router.use('/admin', adminRouter)
router.use('/anakMagang', anakMagangRouter)
router.use('/mentor', mentorRouter)
router.use('/modul', modulRouter)

module.exports= router;