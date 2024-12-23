const express = require('express')
const router = express()

const {
    Course, Mentor, Admin, UserData, AnakMagang,
    Modul, JawabanModul, SoalModul, NilaiModul,Absensi,
    validateArrayOfIDs,
    checkIdValid,
    checkIdExist,
    validateArrayOfIDsCheckRole
} = require("./functions");

const Joi = require('joi');
const mongoose = require('mongoose');
const { upload } = require('./Middleware');