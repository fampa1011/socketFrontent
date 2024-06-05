export const getSender = (loggedUsser, users) =>{
    return users[0]._id === loggedUsser._id ? users[1].name: users[0].name
}