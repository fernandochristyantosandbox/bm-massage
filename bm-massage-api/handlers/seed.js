const db = require('../models/index');

module.exports.seedCities = async function (req, res, next) {
  try {
    const addedCities = db.MsCity.insertMany([
      {
        cityName: 'Jakarta'
      },
      {
        cityName: 'Bogor'
      },
      {
        cityName: 'Bandung'
      },
      {
        cityName: 'Batam'
      }
    ]).then(res => res)
      .catch(err => next({ status: 400, ...err }));

    return res.status(200).json(addedCities);
  }
  catch (err) {
    return next(err);
  }
}

module.exports.seedMassageTypes = async function (req, res, next) {
  try {
    const addedMassageTypes = db.MsMassageType.insertMany([
      {
        name: 'Child Massage'
      },
      {
        name: 'Head, Shoulders, Knees & Toes Massage'
      },
      {
        name: 'Hot Stone Massage'
      },
      {
        name: 'Feet Pedicure & Massage'
      },
      {
        name: 'Facial or Scrub Massage'
      }
    ]).then(res => res)
      .catch(err => next({ status: 400, ...err }));

    return res.status(200).json(addedMassageTypes);
  }
  catch (err) {
    return next(err);
  }
}