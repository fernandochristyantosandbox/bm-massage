const db = require('../models')
const ObjectId = require('mongodb').ObjectId;
const bcrypt = require('bcrypt');
require('dotenv').config()

exports.getAll = async function (req, res, next) {
    try {
        let allAdmins = db.TrAdmin.find({})
            .then(admins => admins)
            .catch(err => next({ status: 400, ...err }));

        return res.status(200).json(allAdmins);
    }
    catch (err) {
        return next(err);
    }
}

/**
 * Get Admin by ID
 * @param {*} id, admin's _id
 */
exports.getByID = async function (req, res, next) {
    try {
        let admin = db.TrAdmin.find({ _id: new ObjectId(req.params.id) })
            .then(admin => admin)
            .catch(err => next({ status: 400, ...err }));

        return res.status(200).json(admin);
    }
    catch (err) {
        return next(err);
    }
}

/**
 * Update user data
 * @param {string} id, user ID
 * @body {TrUser} user, user data to be updated 
 */
exports.update = async function (req, res, next) {
    if (!req.body.admin) {
        return next({ message: 'Incomplete credentials', status: 400 });
    }
    else {
        if (req.body.admin.username) {
            const adminBySameUsername = await db.TrAdmin.find({ username: req.body.admin.username,  _id: { $ne: new ObjectId(req.body.admin._id)}})
                .then(res => res)
                .catch(err => err);
            if (adminBySameUsername.length > 0)
                return next({ message: 'Username is already taken', status: 400 });
        }
    }
    try {
        let updatedAdmin = await db.TrAdmin.findOneAndUpdate({ _id: new ObjectId(req.body.admin._id) },
            {
                ...req.body.admin
            },
            {
                new: true
            })
            .then(res => res)
            .catch(err => next(err));
        return res.status(200).json(updatedAdmin);
    }
    catch (err) {
        next(err);
    }
}

/**
 * Delete admin
 * @param {string} id, user ID
 */
exports.delete = async function (req, res, next) {
    try {
        const admin = await db.TrAdmin.findById(req.params.id);
        let deletedAdmin = await db.TrAdmin.findByIdAndRemove(req.params.id)
            .then(res => res)
            .catch(err => next(err));
        
        const massagePlace = await db.TrMassagePlace.findById(admin.massagePlace._id);
        massagePlace.admins.remove(req.params.id);
        massagePlace.save();
        return res.status(200).json(deletedAdmin);
    }
    catch (err) {
        next(err);
    }
}