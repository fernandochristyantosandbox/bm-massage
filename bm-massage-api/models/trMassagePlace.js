const mongoose = require('mongoose');

const trMassagePlaceSchema = new mongoose.Schema({
    placeName: {
        type: String,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    address: {
        type: String,
    },
    city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MsCity'
    },
    admins: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TrAdmin'
    }],
    massages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TrMassage'
    }]
});

const TrMassagePlace = mongoose.model('TrMassagePlace', trMassagePlaceSchema);

module.exports = TrMassagePlace;