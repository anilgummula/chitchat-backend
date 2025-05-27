// const { required } = require('joi');
const mongoose = require('mongoose');
// const { Profiler } = require('react');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String, 
        required: true, 
    },
    mobile:{
        type: String, 
        default : null,
    },

    password: {
        type: String,
        required: true,
        minlength: 6,
    },

    profilePic:{
        type: String,
        default:"",
    },
    
},
{
    timestamps:true
}
);

module.exports = mongoose.model('User', userSchema);