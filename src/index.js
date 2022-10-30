require('dotenv').config()
const express = require('express')
const {ApolloServer} = require('apollo-server-express')
const typeDefs = require('./modules/graphql/types')
const resolvers = require('./modules/graphql/resolvers')

const cors = require('cors')

const upload = require('./utils/multer')
const cloudinary = require('./utils/cloudinary')
const { response } = require('express')

class Server{
    constructor(){
        this.app = express()
        this.app.use(express.static('public'))
        this.app.use(cors())
        this.apiroutes()
        this.apolloServer = new ApolloServer({typeDefs, resolvers})
        this.init()
        this.apolloServerStart()
    }

    init(){
        require('./init')
    }

    apolloServerStart = async() => {
        await this.apolloServer.start()
        this.apolloServer.applyMiddleware({app: this.app})
    }

    apiroutes(){
        this.app.post('/api/upload', async(req, res) => {
            //return res.send('hola')
            try {
                console.log(req.file)
                const {url} = await cloudinary.uploader.upload(req.file.path, {
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