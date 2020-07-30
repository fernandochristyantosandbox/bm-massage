const db = require('../models/index');
const jwt = require('jsonwebtoken');

/**
 * boss login
 * @param {object} data 
 */
exports.ownerSignIn = async function (req, res, next) {
    try {
        const username = 'owner';
        const password = 'owner'
        const role = 'owner';
        if (req.body.data) {
            if (req.body.data.username === username && req.body.data.password === password) {
                let token = jwt.sign({
                    id: username,
                    username: username,
                    role: role
                }, process.env.SECRET_KEY);

                return res.status(200).json({
                    id: username,
                    username,
                    role,
                    token
                });
            }
            return next({ status: 400, message: 'Invalid credentials' })
        }
        else {
            return next({ status: 400, message: 'Invalid credentials' })
        }
    }
    catch (err) {
        return next({
            status: 400,
            message: 'Invalid email/password.'
        });
    }
}


//MEMBER =============================================================================================================================
/**
 * member signup
 * @body {TrMember} member
 */
exports.memberSignup = async function (req, res, next) {
    try {
        const duplicateMember = await db.TrMember.find({ $or: [{ email: req.body.member.email }, { username: req.body.member.username }] })
            .then(res => res)
            .catch(err => next(err));
        if (duplicateMember.length > 0)
            return next({ status: 400, message: 'Username / email is taken' });

        const member = {
            email: req.body.member.email,
            username: req.body.member.username,
            password: req.body.member.password,
            gender: req.body.member.password
        }

        const insertedMember = await db.TrMember.create({
            ...member
        })
            .then(res => res)
            .catch(err => next(err));

        if (insertedMember) {
            //Create a token (signing a token)
            let token = jwt.sign({
                id: insertedMember._id,
                username: insertedMember.username,
                role: 'member'
            }, process.env.SECRET_KEY);
            return res.status(200).json({
                id: insertedMember._id,
                username: insertedMember.username,
                role: 'member',
                token
            });
        }
    }
    catch (err) {
        next(err);
    }
}

/**
 * member signup
 * @body {TrMember} member
 */
exports.memberSignin = async function (req, res, next) {
    try {
        const member = await db.TrMember.findOne({ username: req.body.member.username, password: req.body.member.password })
            .then(res => res)
            .catch(err => next(err));

        if (member) {
            // Validate is member banned
            const memberActiveBan = await db.TrActiveBan.find({member: member._id});
            if(memberActiveBan !== undefined && memberActiveBan.length > 0)
                return next({status: 400, message: "Ban status is active"})

            //Create a token (signing a token)
            let token = jwt.sign({
                id: member._id,
                username: member.username,
                role: 'member'
            }, process.env.SECRET_KEY);
            return res.status(200).json({
                id: member._id,
                username: member.username,
                role: 'member',
                token
            });
        }
        else {
            next({ status: 403, message: "Invalid credentials" });
        }
    }
    catch (err) {
        return next(err);
    }
}


//ADMIN =============================================================================================================================
/**
 * 
 * @body {string} username
 * @body {string} password
 */
exports.adminSignin = async function (req, res, next) {
    try {
        const admins = await db.TrAdmin.find({ username: req.body.username, password: req.body.password })
            .then(res => res)
            .catch(err => next(err));

        if (admins && admins.length > 0) {
            const admin = admins[0]
            //Create a token (signing a token)
            let token = jwt.sign({
                id: admin._id,
                username: admin.username,
                role: 'admin',
                massageplaceid: admin.massagePlace
            }, process.env.SECRET_KEY);
            return res.status(200).json({
                id: admin._id,
                username: admin.username,
                role: 'admin',
                massageplaceid: admin.massagePlace,
                token
            });
        }
        else{
            return next({status: 403, message: 'Invalid Credentials'});
        }
    }
    catch (err) {
        return next(err);
    }
}