const { fetchUsers, paginateUsers, createUser, updateUser, authUser, authUserByToken } = require("../../services")

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
        }
    },
    Mutation: {
        createUser: async(_, {user: {username, password, email, name, surname}}) => {
            return await createUser({username, password, email, name, surname})
        },
        updateUser: async(_, {user: {token, username, password, name, surname, email}})=>{
            return await updateUser(token, {username, password, name, surname, email})
        }
    }
}

module.exports = resolvers