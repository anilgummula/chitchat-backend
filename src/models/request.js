const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
    name :  { type: String, required: false },
    email :  { type: String, required: false },
    id :  { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    rid :  { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    accept : {type : Boolean , default:false},
    status : {type : Boolean, default:false},
}) 

module.exports = mongoose.model('request',RequestSchema);