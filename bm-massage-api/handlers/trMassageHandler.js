const db = require('../models');



/**
 * 
 * @param {string} massageplaceid  
 * @body {Trmassage} massage 
 * @param {*} next 
 */
exports.insert = async function (req, res, next) {
    try {
        const massageplace = await db.TrMassagePlace.findById(req.params.massageplaceid)
            .then(res => res)
            .catch(err => next(err));

        const massage = {
            ...req.body.massage,
            massagePlace: req.params.massageplaceid
        }

        const massageType = await db.MsMassageType.findById(req.body.massage.massageType)
            .then(res => res)
            .catch(err => err);

        //insert new
        const insertedMassage = await db.TrMassage.create(massage)
            .then(res => res)
            .catch(err => next(err));
        massageplace.massages.push(insertedMassage.id);
        await massageplace.save();

        massageType.massages.push(insertedMassage.id);
        await massageType.save();

        return res.status(200).json(insertedMassage);
    }
    catch (err) {
        next(err);
    }
}