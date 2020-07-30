const db = require('../models/index');

exports.getAllCities = async function(req, res, next){
    try{
        let allCities = await db.MsCity.find({})
            .then(cities => cities)
            .catch(err => next({ status: 400, ...err}));

        return res.status(200).json(allCities);
    }
    catch(err){
        return next(err);
    }
}

/**
 * Insert new admin and to massageplace
 * @param {string} id
 */
exports.getAllMassagePlaces = async function (req, res, next) {
    try {
        const city = await db.MsCity.findById(req.params.id)
            .populate("massagePlaces")
            .then(res => res)
            .catch(err => next(err));
        return res.status(200).json(city.massagePlaces);
    }
    catch (err) {
        next(err);
    }
}