const mongoose = require('mongoose');

const Product = mongoose.model('product', { 
    image: {type: String, unique: false, required: true},
    title: {type: String, unique: true, required: true},
    description: {type: String, unique: false, required: false},
    price: {type: String, unique: false, required: true},
    // stock: {type: Number, unique: false, required: false, default: ''} //TODO: ¿Es necesario?
    category: {type: String, unique: false, enum:['ALIMENTO', 'INDUMENTARIA', 'ACCESORIOS', 'JUGUETES', 'PRODUCTOS VETERINARIOS', 'PLANTAS', 'MACETAS'], required: true}
})

module.exports = Product