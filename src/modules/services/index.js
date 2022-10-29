//UserServices

const {
fetchUsers,
paginateUsers,
createUser,
updateUser,
authUser,
authUserByToken,
existUser } = require('./userServices')

//ProductServices

const {
    createProduct,
    updateProduct,
    deleteProduct,
    getProducts,
    getFilterProducts
} = require('./productService')

module.exports = {
    fetchUsers,
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
    getFilterProducts
}