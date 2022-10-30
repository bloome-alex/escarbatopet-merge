require('dotenv').config()
const express = require('express')
const {ApolloServer} = require('apollo-server-express')
const typeDefs = require('./modules/graphql/types')
const resolvers = require('./modules/graphql/resolvers')
const cloudinary = require('./utils/cloudinary')
const upload = require('./utils/multer')
const { response } = require('express')
const FormData = require('form-data')

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
        this.app.post('/api/upload', upload.single('file'), async(req, res) => {
            //return res.send('hola')
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
    }

    listen(port){
        this.app.listen(port, () => {
            console.log(`listen at port ${port}`)
        })
    }
}

const server = new Server()

server.listen(process.env.PORT)