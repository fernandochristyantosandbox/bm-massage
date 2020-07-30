const mongoose = require('mongoose');

const trOrderSchema = new mongoose.Schema({
    member: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TrMember'
    },
    massage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TrMassage'
    }
},
{
    timestamps: true
});

const TrOrder = mongoose.model('TrOrder', trOrderSchema);

module.exports = TrOrder;