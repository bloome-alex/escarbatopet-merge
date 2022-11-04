const mongoose = require('mongoose');

const Category = mongoose.model('category', { 
    categories: {type: [String], required: true}
})

module.exports = Category