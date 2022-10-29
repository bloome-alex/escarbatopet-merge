require('dotenv').config()
const express = require('express')
const {ApolloServer} = require('apollo-server-express')
const typeDefs = require('./modules/graphql/types')
const resolvers = require('./modules/graphql/resolvers')

class Server{
    constructor(){
        this.app = express()
        this.app.use(express.static('public'))
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

    listen(port){
        this.app.listen(port, () => {
            console.log(`listen at port ${port}`)
        })
    }
}

const server = new Server()

server.listen(process.env.PORT)