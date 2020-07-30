const db = require('../models');

exports.getallMassageTypes = async function(req, res, next){
    try{
        let allMassageTypes = await db.MsMassageType.find({})
            .then(massageTypes => massageTypes)
            .catch(err => next({ status: 400, ...err}));

        return res.status(200).json(allMassageTypes);
    }
    catch(err){
        return next(err);
    }
}