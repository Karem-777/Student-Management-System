const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = mongoose.Schema({
    ID:{
        type: String,
        required: [true, 'please tell us your ID']
    },
    name: {
        type: String,
        required: [true, 'please tell us your name']
    },
    email:{
        type: String,
        required: [true, 'please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'please provide a valid email']
    }
})

const User = mongoose.model('User', userSchema);
module.exports = User;