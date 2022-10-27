const {
fetchUsers,
paginateUsers,
createUser,
updateUser,
authUser,
authUserByToken } = require('./userServices')

module.exports = {
    fetchUsers,
    paginateUsers,
    createUser,
    updateUser,
    authUser,
    authUserByToken
}