const mongoose = require('mongoose')

const msMassageTypeSchema = mongoose.Schema({
    name: {
        type: String
    },
    massages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TrMassage'
    }]
})

const MsMassageType = mongoose.model('MsMassageType', msMassageTypeSchema);

module.exports = MsMassageType;