const mongoose = require('mongoose');

const trMemberSchema = new mongoose.Schema({
    gender:{
        type: String
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TrOrder'
    }],
    orderHistories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'HrOrder'
    }]
},
{
    timestamps: true
});

const TrMember = mongoose.model('TrMember', trMemberSchema);

module.exports = TrMember;