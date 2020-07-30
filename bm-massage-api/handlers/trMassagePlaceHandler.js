const db = require('../models/index');
const ObjectId = require('mongodb').ObjectId;

/**
 * Insert new admin and to massageplace
 * @param {string} massageplaceid 
 * @body {TrAdmin} admin, new admin data
 */
exports.addAdmin = async function (req, res, next) {
    try {
        let massagePlace = await db.TrMassagePlace.findById(req.params.massageplaceid)
            .then(res => res)
            .catch(err => next(err));

        if (req.body.admin.username) {
            const adminBySameUsername = await db.TrAdmin.find({ username: req.body.admin.username, _id: { $ne: new ObjectId(req.body.admin._id) } })
            if (adminBySameUsername.length > 0)
                return next({ status: 400, message: 'Duplicate username' })
        }
        let insertedAdmin = await db.TrAdmin.create({
            ...req.body.admin,
            massagePlace: massagePlace.id
        })
            .then(res => res)
            .catch(err => next(err));

        massagePlace.admins.push(insertedAdmin.id);
        await massagePlace.save();
        return res.status(200).json(insertedAdmin);
    }
    catch (err) {
        next(err);
    }
}

/**
 * Get admin by city
 * @param {string} massageplaceid 
 */
exports.getAdmins = async function (req, res, next) {
    try {
        const massagePlace = await db.TrMassagePlace
            .findById(req.params.massageplaceid)
            .populate("admins")
            .then(res => res)
            .catch(err => next(err));

        return res.status(200).json(massagePlace.admins);
    }
    catch (err) {
        next(err);
    }
}

/**
 * Insert massageplace
 * @param {string} cityid
 * @body {TrMassagePlace} massagePlace, new massagePlace
 */
exports.insert = async function (req, res, next) {
    try {
        let city = await db.MsCity.findById(req.params.cityid);
        let newMassagePlace = await db.TrMassagePlace.create({
            ...req.body,
            city: req.params.cityid
        })
            .then(res => res)
            .catch(err => next(err));

        city.massagePlaces.push(newMassagePlace.id);
        await city.save();

        return res.status(200).json(newMassagePlace);
    }
    catch (err) {
        next(err);
    }
}

/**
 * updates massageplace
 * @param {string} massageplaceid
 * @body {TrMassagePlace} massagePlace, massagePlace
 */
exports.update = async function (req, res, next) {
    try {
        let updatedMassagePlace = await db.TrMassagePlace.findOneAndUpdate({ _id: new ObjectId(req.body.massagePlace._id) }, {
            ...req.body.massagePlace,
        }, {
                new: true
            })
            .then(res => res)
            .catch(err => next(err));
        return res.status(200).json(updatedMassagePlace);
    }
    catch (err) {
        next(err);
    }
}

/**
 * Get massageplace detail
 * @param {string} massageplaceid
 */
exports.getDetail = async function (req, res, next) {
    try {
        let massagePlace = await db.TrMassagePlace.findById(req.params.massageplaceid)
            .populate({
                path: "city"
            })
            .populate({
                path: "admins"
            })
            .populate({
                path: "massagers"
            })
            .populate({
                path: "massages",
                populate: [
                    { path: "orders" },
                    { path: "orderHistories" },
                    { path: "massageType" }
                ]
            })
        if (massagePlace)
            return res.status(200).json(massagePlace);
        else
            return next({ message: 'Massage place not found', status: 204 });
    }
    catch (err) {
        next(err);
    }
}

/**
 * Get all massageplace detail
 */
exports.getAllWithDetail = async function (req, res, next) {
    try {
        let massagePlaces = await db.TrMassagePlace.find({})
            .populate({
                path: "city"
            })
            .populate({
                path: "admins"
            })
            .populate({
                path: "massagers"
            })
            .populate({
                path: "massages",
                populate: [
                    { path: "orders" }
                ]
            })
        if (massagePlaces) {
            const massagePlacesWithOrderCount = massagePlaces.map(massagePlace => {
                let currentOrderCount = 0;
                massagePlace.massages.forEach(massage => {
                    currentOrderCount += massage.orders.length;
                });
                const updatedMassagePlace = massagePlace.toObject();
                updatedMassagePlace.orderCount = currentOrderCount;
                return updatedMassagePlace;
            });
            return res.status(200).send(massagePlacesWithOrderCount);
        }
        else
            return next({ message: 'No massage place found', status: 204 });
    }
    catch (err) {
        next(err);
    }
}

/**
 * Get today's ongoing orders
 * @param {string} massageplaceid
 */
exports.getOngoingOrders = async function (req, res, next) {
    try {
        const massageplaceid = req.params.massageplaceid;

        const massages = await db.TrMassage.find({ massagePlace: massageplaceid })
            .then(res => res)
            .catch(err => next(err));

        const massageIDs = massages.map(massage => massage.id);
        const orders = await db.TrOrder.find({ massage: { $in: massageIDs } })
            .sort({ createdAt: -1 })
            .populate({
                "path": "member",
                "select": {
                    "password": 0,
                    "orders": 0,
                    "orderHistories": 0
                }
            })
            .populate({
                "path": "massage",
                "select": {
                    "price": 1,
                    "massageName": 1
                },
                "populate": [
                    {
                        "path": "massageType",
                        "select": {
                            "name": 1
                        }
                    }
                ]
            });
        return res.status(200).json(orders);
    }
    catch (err) {
        return next(err);
    }
}

/**
 * 
 * @param {string} massageplaceid 
 */
exports.getOrderLog = async function (req, res, next) {
    const massageplaceid = req.params.massageplaceid;
    if (!massageplaceid)
        return next({ status: 400, message: 'Undefined massage place' });

    const massagePlace = await db.TrMassagePlace.findById(massageplaceid)
        .then(res => res)
        .catch(err => next(err));

    const massageIDs = massagePlace.massages;

    const hrOrders = await db.HrOrder.find({ massage: { $in: massageIDs } })
        .sort({ createdAt: -1 })
        .populate({
            "path": "massage",
            "select": {
                "massageName": 1,
                "price": 1
            },
            "populate": [
                {
                    "path": "massageType",
                    "select": {
                        "name": 1
                    }
                }
            ]
        })
        .populate({
            "path": "member",
            "select": {
                "gender": 1,
                "username": 1,
                "email": 1
            }
        })
        .then(res => res)
        .catch(err => err);
    return res.status(200).json(hrOrders);
}

/**
 * 
 * @param {string} massageplaceid 
 */
exports.getMemberControlList = async function (req, res, next) {
    try {
        const { massageplaceid } = req.params;

        const massages = await db.TrMassage
            .find({ massagePlace: massageplaceid })
            .select({
                "isComplete": 1,
            })
            .populate({
                "path": "orderHistories",
                "select": {
                    "member": 1,
                    "isComplete": 1
                },
                "populate": [
                    {
                        "path": "member",
                        "select": {
                            "password": 0,
                            "orders": 0,
                            "orderHistories": 0
                        }
                    }
                ]
            })
            .then(res => res)
            .catch(err => next(err));

        let members = {}
        /**
         * {
         *   memberid: {
         *      expired: 
         *      completed: 
         *   }
         * }
         */
        massages.forEach(massage => {
            massage.orderHistories.forEach(orderHistory => {
                //Append completed / expired
                if (orderHistory.member._id in members) {
                    if (orderHistory.isComplete)
                        members[orderHistory.member._id].completed = members[orderHistory.member._id].completed + 1;
                    else    
                        members[orderHistory.member._id].expired = members[orderHistory.member._id].expired + 1;
                }
                else {
                    members[orderHistory.member._id] = {
                        expired: 0,
                        completed: 0,
                        _id: orderHistory.member._id,
                        email: orderHistory.member.email,
                        gender: orderHistory.member.gender,
                        username: orderHistory.member.username,
                        hasBanRequest: false,
                        hasActiveBan: false
                    }
                    if (orderHistory.isComplete)
                        members[orderHistory.member._id].completed = members[orderHistory.member._id].completed + 1;
                    else
                        members[orderHistory.member._id].expired = members[orderHistory.member._id].expired + 1;
                }
            });
        });

        const trBanRequestPromises = Object.keys(members).map(memberID => {
            const member = members[memberID];
            return db.TrBanRequest.find({member: member._id})
        });

        const trActiveRequestPromises = Object.keys(members).map(memberID => {
            const member = members[memberID];
            return db.TrActiveBan.find({member: member._id})
        });

        //Does member(s) has ban request?
        await Promise.all([...trBanRequestPromises])
        .then(banRequestResolves => {
            banRequestResolves.forEach(banRequests => {
                if(banRequests.length > 0)
                    members[banRequests[0].member].hasBanRequest = true;
            })
        })

        //Does member(s) has active ban?
        await Promise.all([...trActiveRequestPromises])
        .then(activeBanResolves => {
            activeBanResolves.forEach(activeBans => {
                if(activeBans.length > 0)
                    members[activeBans[0].member].hasActiveBan = true;
            })
        })

        return res.status(200).json(members);
    }
    catch (err) {
        return next(err);
    }
}