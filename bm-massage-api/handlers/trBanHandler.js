const db = require('../models');

/**
 * @body {object}
 *      @prop {string} memberid
 *      @prop {string} requestedBy
 *      @prop {string} massagePlace
 *      @prop {string} reason
 */
exports.createBanRequest = async function (req, res, next) {
    try {
        const { reason, massagePlace, requestedBy, memberid } = req.body;
        const newBan = await db.TrBanRequest.create({
            reason: reason,
            massagePlace: massagePlace,
            member: memberid,
            requestedBy: requestedBy
        })
            .then(res => res)
            .catch(err => next(err));

        return res.status(200).json(newBan);
    }
    catch (err) {
        return next(err);
    }
}


/**
 * 
 */
exports.getBanRequests = async function (req, res, next) {
    try {
        const banRequests = await db.TrBanRequest.find({})
            .populate("member")
            .populate({
                path: "requestedBy",
                populate: [{
                    path: "massagePlace",
                    populate: [
                        { path: "city" }
                    ]
                }]
            })

        return res.status(200).json(banRequests);
    }
    catch (err) {
        return next(err);
    }
}

/**
 * 
 * @param {string} banid, ban ID 
 */
exports.revokeBanRequest = async function (req, res, next) {
    try {
        const { banid } = req.params;

        const revokedBanRequest = await db.TrBanRequest.findByIdAndRemove(banid)
            .then(revokedBan => revokedBan)
            .catch(err => {
                return next(err);
            });

        res.status(200).json(revokedBanRequest);
    }
    catch (err) {
        return next(err);
    }
}

/**
 * 
 * @param {string} banid 
 */
exports.banMember = async function (req, res, next) {
    try {
        const { banid } = req.params;

        const banRequest = await db.TrBanRequest.findById(banid);

        // MARK BAN AS ACTIVE (INSERT) THEN REMOVE REQUEST
        const removedBanRequest = await db.TrActiveBan.create({
            massagePlace: banRequest.massagePlace,
            member: banRequest.member,
            reason: banRequest.reason,
            requestedBy: banRequest.requestedBy
        })
            .then(ban => {
                return db.TrBanRequest.findByIdAndRemove(banid);
            })
            .then(removedBan => removedBan)
            .catch(err => next(err));
        
        return res.status(200).json(removedBanRequest);
    }
    catch (err) {
        return next(err);
    }
}
