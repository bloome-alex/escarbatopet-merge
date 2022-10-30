const User = require('../models/User')
const jwt = require('jsonwebtoken')
const Product = require('../models/Product')
const cloudinary = require('../../utils/cloudinary')


const createProduct = async(token, image, title, description = '', price, category) => {

    const {url} = await cloudinary.uploader.upload(image, {
        folder: 'products'
    })

    const {user: {username: usernameToken}} = jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findOne({username: usernameToken})

    if(!user.role.includes('ADMIN') && !user.role.includes('SUPERUSER')) throw new Error('permisos insuficientes')

    return await Product.create({
        image: url,
        title: title.toLowerCase(),
        description,
        price,
        category
    })
}

const updateProduct = async(token, image, title, description = '', price, category) => {
    const {user: {username: usernameToken}} = jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findOne({username: usernameToken})

    if(!user.role.includes('ADMIN') && !user.role.includes('SUPERUSER')) throw new Error('permisos insuficientes')

    await Product.updateOne({title}, { 
        image, 
        title: title.toLowerCase(), 
        description, 
        price, 
        category 
    })

    const updateProduct = await Product.findOne({title})

    return {
        image: updateProduct.image, 
        title: updateProduct.title, 
        description: updateProduct.description, 
        price: updateProduct.price, 
        category: updateProduct.category 
    }
}

const uploadImage = async(image) => {
    console.log(image)
    const {url} = await cloudinary.uploader.upload(image, {
        folder: 'products'
    })
    return url
}

const deleteProduct = async(token, title) => {
    const {user: {username: usernameToken}} = jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findOne({username: usernameToken})

    if(!user.role.includes('ADMIN') && !user.role.includes('SUPERUSER')) throw new Error('permisos insuficientes')

    const product = await Product.findOne({title})

    const result = await Product.deleteOne({title})

    if(result.deletedCount != 1) throw new Error('Document not exist')

    return product
}

const getProducts = async() => {
    return Product.find({})
}

const getOneProduct = async(title) => {
    return Product.findOne({title})
}

const getFilterProducts = async(category='', title='', page=1, items=6) => {
    
    const titleRegex = new RegExp(`${title.toLowerCase()}`, 'g')
    const categoryRegex = new RegExp(`^${category}`, 'g')
    
    if(page==0 && items ==0){
        return Product.find({
            title: {$regex: titleRegex},
            category
        })
    }
    
    return Product.find({
        title: {$regex: titleRegex},
        category: {$regex: categoryRegex}
    })
    .limit(items)
    .skip((page-1)*items)
}


module.exports = {
    createProduct,
    updateProduct,
    deleteProduct,
    getProducts,
    getFilterProducts,
    uploadImage
}