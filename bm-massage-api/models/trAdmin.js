const mongoose = require('mongoose');

const trAdminSchema = new mongoose.Schema({
    adminName: {
        type: String,
        required: true
    },
    username: {
        type: String
    },
    password: {
        type: String
    },
    active: {
        type: Boolean
    },
    massagePlace: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TrMassagePlace'
    }
});

const TrAdmin = mongoose.model('TrAdmin', trAdminSchema);

module.exports = TrAdmin;