const mongoose = require('mongoose');

const User = mongoose.model('user', {
    username: {type: String, unique: true, index: true, required: true}, 
    name: {type: String, unique: false, required: false, default: ''},
    surname: {type: String, unique: false, required: false, default: ''},
    role: {type: String, enum: ['ADMIN', 'USER', 'SUPERUSER'], default: 'USER', required: true},
    password: {type: String, unique: false, required: true},
    email: {type: String, unique: true, required: true},
    address: {type: String, unique: false, required: false, default: ''}
})

module.exports = User