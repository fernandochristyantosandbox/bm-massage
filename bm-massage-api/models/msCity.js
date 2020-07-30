const mongoose = require('mongoose');

const msCitySchema = new mongoose.Schema({
    cityName: {
        type: String,
        required: true
    },
    massagePlaces: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TrMassagePlace'
    }]
});

const MsCity = mongoose.model('MsCity', msCitySchema);

module.exports = MsCity;