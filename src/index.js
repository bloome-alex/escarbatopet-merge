require('dotenv').config()
const express = require('express')
const {ApolloServer} = require('apollo-server-express')
const typeDefs = require('./modules/graphql/types')
const resolvers = require('./modules/graphql/resolvers')
const cloudinary = require('./utils/cloudinary')
const upload = require('./utils/multer')
const { response } = require('express')
const { recoverAccount, getTokenByEmail } = require('./modules/services')

const emailRecovers = []

class Server{
    constructor(){
        this.app = express()
        this.app.use(express.static('public'))
        this.app.use(express.json())
        this.apolloServer = new ApolloServer({typeDefs, resolvers})
        this.init()
        this.apolloServerStart()
        this.apiroutes()
    }

    init(){
        require('./init')
    }

    apolloServerStart = async() => {
        await this.apolloServer.start()
        this.apolloServer.applyMiddleware({app: this.app})
    }

    apiroutes(){
        this.app.get('/home', (req, res) => res.redirect('/'))
        this.app.get('/shop', (req, res) => res.redirect('/'))
        this.app.get('/register', (req, res) => res.redirect('/'))
        this.app.get('/contact-us', (req, res) => res.redirect('/'))
        this.app.get('/profile', (req, res) => res.redirect('/'))
        this.app.get('/cart', (req, res) => res.redirect('/'))
        this.app.get('/history-shop', (req, res) => res.redirect('/'))

        this.app.post('/api/upload', upload.single('file'), async(req, res) => {
            try {
                if(!req.file) throw new Error('undefined file')
                const {url = ''} = await cloudinary.uploader.upload(req.file.path, {
                    folder: 'Images'
                });
                res.status(202).json({
                    url
                })    
            } catch (error) {
                response.status(402).json({
                    msg: 'bad gateway',
                    error
                })
            }
        })

        this.app.post('/api/recoverAccount', async(req, res) => {
            const {email} = req.body
            try {
                const resp = await recoverAccount(email)
                emailRecovers.push({email, recover: resp})
                return resp ? res.status(200).json({op: true}) : res.status(400).json({op: false})
            } catch (error) {
                console.log(error)
                return res.status(504).json({msg: 'error'})
            }
        })

        this.app.post('/api/recover/:id', async(req, res) => {
            const {email} = req.body
            const {id} = req.params

            let validate = false

            emailRecovers.forEach(async (e, i)=>{
                if(e.email == email && e.recover == id){
                    validate = true
                    emailRecovers.splice(i, 1)
                }
            })

            if(validate){
                const token = await getTokenByEmail(email)
                return res.status(200).json({
                    token
                })
            }

            return res.status(400).send(validate)
        })
    }

    listen(port){
        this.app.listen(port, () => {
            console.log(`listen at port ${port}`)
        })
    }
}

const server = new Server()

server.listen(process.env.PORT)