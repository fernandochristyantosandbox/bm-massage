const mongoose = require('mongoose');

const trMassageSchema = new mongoose.Schema({
    massageName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    massageType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MsMassageType'
    },
    massagePlace: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TrMassagePlace'
    },
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TrOrder'
    }],
    orderHistories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'HrOrder'
    }]
});

const TrMassage = mongoose.model('TrMassage', trMassageSchema);

module.exports = TrMassage;