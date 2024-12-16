const express = require('express')
const router = express()
const mongoose = require('mongoose');

const Mentor = require('../models/Mentor');
const Admin = require('../models/Admin')
const UserData = require('../models/UserData')
const AnakMagang = require('../models/AnakMagang');
const Course = require('../models/Course');
const Modul = require('../models/Modul');
const JawabanModul = require('../models/JawabanModul');
const SoalModul = require('../models/SoalModul');
const NilaiModul = require('../models/NilaiModul');


const validateArrayOfIDs = async (model, mappedId, modelName) => {

    if (!Array.isArray(mappedId)) {
        throw new Error(`${modelName} IDs must be provided as an array.`);
    }

    let ids;
    try {
        ids = mappedId.map((id) => new mongoose.Types.ObjectId(id));
    } catch (err) {
        throw new Error(`Invalid ${modelName} ID format.`);
    }

    const validDocuments = await model.find({ _id: { $in: ids } });

    if (validDocuments.length !== ids.length) {
        throw new Error(`One or more IDs do not exist in the ${modelName} collection.`);
    }

    return validDocuments.map((doc) => doc._id);
};
const checkIdValid = (value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid", { value });
    }
    return value;
}

module.exports = {
    validateArrayOfIDs,
    checkIdValid,
    Course,
    Mentor,
    Admin,
    UserData,
    Course,
    AnakMagang,
    Modul,
    JawabanModul,
    SoalModul,
    NilaiModul
};