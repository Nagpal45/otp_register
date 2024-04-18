const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    location: String,
    age: Number,
    work: String,
    otp: String,
})

const User = mongoose.model('User', userSchema);
module.exports = User;