const mongoose = require('mongoose');

const hrOrderSchema = new mongoose.Schema({
    rating: {
        type: Number,
        min: 0,
        max: 5
    },
    isComplete: {
        type: Boolean,
        required: true
    },
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

const HrOrder = mongoose.model('HrOrder', hrOrderSchema);

module.exports = HrOrder;