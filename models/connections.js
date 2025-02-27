const mongoose = require('mongoose');

const ConnectionSchema = new mongoose.Schema({
    name :  { type: String, required: true },
    id :  { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    cids :  [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
}) 

module.exports = mongoose.model('connections',ConnectionSchema);