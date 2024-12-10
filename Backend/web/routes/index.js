
const userDataRouter = require('./userData.route')
const adminRouter = require('./Admin.route')
const anakMagangRouter = require('./anakMagang.route')
const mentorRouter = require('./Mentor.route')
const modulRouter = require('./Modul.route')
const express = require('express')
const router = express()


router.use('/user', userDataRouter)
router.use('/admin', adminRouter)
router.use('/anakMagang', anakMagangRouter)
router.use('/mentor', mentorRouter)
router.use('/modul', modulRouter)

module.exports= router;