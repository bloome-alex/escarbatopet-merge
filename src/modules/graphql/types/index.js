require('graphql-import-node')
const {mergeTypes} = require('merge-graphql-schemas');
const UserTypes = require('./UserTypes.graphql')
const ProductTypes = require('./ProductTypes.graphql')

const typeDefs = mergeTypes([UserTypes, ProductTypes], {
    all: true
})

module.exports = typeDefs