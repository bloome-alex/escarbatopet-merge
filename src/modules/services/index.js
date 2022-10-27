const {
fetchUsers,
paginateUsers,
createUser,
updateUser,
authUser,
authUserByToken,
existUser } = require('./userServices')

module.exports = {
    fetchUsers,
    paginateUsers,
    createUser,
    updateUser,
    authUser,
    authUserByToken,
    existUser
}