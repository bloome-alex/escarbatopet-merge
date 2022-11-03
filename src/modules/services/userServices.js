const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const isEmail = require('validator/lib/isEmail')
const transporter = require('../../init/mailer')

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

    const {user: {email: emailToken}} = jwt.verify(token, process.env.JWT_SECRET)
    if(emailToken != email) throw new Error('Unauthorized')

    const body = {}

    if(password) body.password = bcrypt.hashSync(password, salt)
    if(username) body.username = username
    if(name) body.name = name
    if(surname) body.surname = surname
    if(role) body.role = role
    if(email) body.email = email
    if(address) body.address = address

    await User.updateOne({email}, body)

    return await User.findOne({email})
}

const authUser = async(username, password) => {
    const user = await User.findOne({username})
    const access = bcrypt.compareSync(password, user.password)
    if(!access) throw new Error('Unauthorized')

    const token = jwt.sign({user: {
        username: user.username,
        name: user.name,
        surname: user.surname,
        email: user.email,
        address: user.address
    }}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })

    return {
        username: user.username,
        name: user.name,
        surname: user.surname,
        email: user.email,
        address: user.address,
        role: user.role,
        token
    }
}

const authUserByToken = async(token)=>{
    const {user: {username, name, surname, email, address}} = jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findOne({username})
    return {
        username: user.username,
        name: user.name,
        surname: user.surname,
        email: user.email,
        token,
        address: user.address,
        role: user.role
    }
}

const existUser = async(email, username)=>{
    let resp = {email: false, username: false}

    if(email){
        data = await User.findOne({email: email.toLowerCase()}).exec()
        if(data) resp.email = true
    }
    if(username){
        data = await User.findOne({username: username.toLowerCase()}).exec()
        if(data) resp.username = true
    }
    return resp
}

const recoverAccount = async(email) => {
    data = await User.findOne({email: email.toLowerCase()}).exec()
    if(data){
        const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result= '';
        const charactersLength = characters.length;
        for ( let i = 0; i < 6; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        // send mail with defined transport object
        await transporter.sendMail({
            from: '"EscarbatoPetshop - ¿Olvidó su contraseña?" <escarbatopet@gmail.com>', // sender address
            to: email, // list of receivers
            subject: "EscarbatoPetshop - ¿Olvidó su contraseña?", // Subject line
            html: `
            <html>
            <p>Hola <b>${data.username}</b> recibimos que no podes iniciar sesión.</p>
            <p>Con el cambio de contraseña mas tu nombre de usuario: <b>${data.username}</b> debería ser suficiente para ingresar denuevo! Saludos!</p>
            <br><b><em>Si usted no olvidó su contraseña descarte este gmail</em></b><br><br>
            Codigo de verificación: <h1>${result}</h1>
            </html>
            `, // html body
        });
        return result
    }
    return false
}

const getTokenByEmail = async(email) => {
    const user = await User.findOne({email: email.toLowerCase()}).exec()
    if(data){
        const token = jwt.sign({user: {
            username: user.username,
            name: user.name,
            surname: user.surname,
            email: user.email,
            address: user.address
        }}, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        })
        return token
    }
    return false
}

module.exports = {
    fetchUsers,
    paginateUsers,
    createUser,
    updateUser,
    authUser,
    authUserByToken,
    existUser,
    recoverAccount,
    getTokenByEmail
}