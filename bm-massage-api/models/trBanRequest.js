const mongoose = require('mongoose');

const trBanRequest = new mongoose.Schema({
    massagePlace: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TrMassagePlace'
    },
    member: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TrMember'
    },
    reason: {
        type: String
    },
    requestedBy:{
        type: mongoose.Schema.ObjectId,
        ref: 'TrAdmin'
    }
},{
    timestamps: true
});

const TrBanRequest = mongoose.model('TrBanRequest', trBanRequest);

module.exports = TrBanRequest;