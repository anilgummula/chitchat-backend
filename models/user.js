const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile:{type: String, default : null},
  address : {type : String , default : null},
  password: { type: String, required: true },
});

module.exports = mongoose.model('user', UserSchema);