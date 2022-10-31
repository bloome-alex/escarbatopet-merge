const { fetchUsers, 
    paginateUsers, 
    createUser, 
    updateUser, 
    authUser, 
    authUserByToken, 
    existUser, 
    createProduct, 
    updateProduct, 
    deleteProduct, 
    getProducts, 
    getFilterProducts,
    uploadImage } = require("../../services")

const resolvers = {
    Query: {
        getUsers: async() => {
            return await fetchUsers()
        },
        paginateUsers: async(_, {page, users}) => {
            return await paginateUsers(page, users)
        },
        authUser: async(_, {username, password}) => {
            return await authUser(username, password)
        },
        authUserByToken: async(_, {token}) => {
            return await authUserByToken(token)
        },
        existUser: async(_, {email=false, username=false}) => {
            return await existUser(email, username)
        },
        getProducts: async() => {
            return await getProducts()
        },
        getFilterProducts: async(_, {filter: {category, title, page, items}}) => {
            return await getFilterProducts(category, title, page, items)
        }
    },
    Mutation: {
        createUser: async(_, {user: {username, password, email, name, surname}}) => {
            return await createUser({username, password, email, name, surname})
        },
        updateUser: async(_, {user: {token, username, password, name, surname, email, address}})=>{
            return await updateUser(token, {username, password, name, surname, email, address})
        },
        createProduct: async(_, {product: {token, image, title, description, price, category}}) => {
            return await createProduct(token, image, title, description, price, category)
        },
        updateProduct: async(_, {product: {token, image, title, description, price, category}}) => {
            return await updateProduct(token, image, title, description, price, category)
        },
        deleteProduct: async(_, {token, title}) => {
            return await deleteProduct(token, title)
        },
    }
}

module.exports = resolvers