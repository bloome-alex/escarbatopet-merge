const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const isEmail = require('validator/lib/isEmail')

const salt = bcrypt.genSaltSync(10)

const fetchUsers = async() => {
    return await User.find({})
}

const paginateUsers = async(page, users) => {
    const skip = (page-1) * users
    const limit = users
    return await User.find({})
    .skip(skip)
    .limit(limit)
}

const createUser = async({username, password, name = '', surname = '', role = 'USER', email, address}) =>{

    if(!username || !password || !email) throw new Error('Campos vacios.')

    if(!isEmail(email)) throw new Error('Email invalido.')

    password = bcrypt.hashSync(password, salt)

    return await User.create({
        username,
        email,
        password,
        name,
        surname,
        role,
        address
    })
}

const updateUser = async(token, {username, password, name, surname, role = 'USER', email, address}) => {
    if(!token || !email) throw new Error('Campos vacios.')

    if(!isEmail(email)) throw new Error('Email invalido.')

    jwt.verify(token, process.env.JWT_SECRET)

    const body = {}

    if(password) body.password = bcrypt.hashSync(password, salt)
    if(username) body.username = username
    if(name) body.name = name
    if(surname) body.surname = surname
    if(role) body.role = role
    if(email) body.email = email
    if(address) body.username = address

    await User.updateOne({username}, body)

    return await User.findOne({username})
}

const authUser = async(username, password) => {
    const user = await User.findOne({username})
    const access = bcrypt.compareSync(password, user.password)
    if(!access) throw new Error('Unauthorized')

    const token = jwt.sign({user: {
        username: user.username,
        name: user.name,
        surname: user.surname,
        email: user.email
    }}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })

    return {
        username: user.username,
        name: username.name,
        surname: username.surname,
        token
    }
}

module.exports = {
    fetchUsers,
    paginateUsers,
    createUser,
    updateUser,
    authUser
}