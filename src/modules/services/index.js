//UserServices

const {
fetchUsers,
paginateUsers,
createUser,
updateUser,
authUser,
authUserByToken,
existUser,
recoverAccount,
getTokenByEmail } = require('./userServices')

//ProductServices

const {
    createProduct,
    updateProduct,
    deleteProduct,
    getProducts,
    getFilterProducts,
    uploadImage,
    getCategories
} = require('./productService')

module.exports = {
    getTokenByEmail,
    recoverAccount,
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
    getFilterProducts,
    uploadImage,
    getCategories
}