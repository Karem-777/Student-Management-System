const mongoose = require('mongoose');
const validator = require('validator');

const studentSchema = mongoose.Schema({
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
    },
    CGPA:{
        type: Number,
        default: 0
    },
    status:{
        type: String,
        enum: {
        values: ['currentStudent', 'GraduteStudent'],
        message: 'status is either: currentStudent or GraduteStudent'
        },
        default: 'currentStudent'
    }
})

const Student = mongoose.model('User', studentSchema);
module.exports = Student;