export const getSenderName = (loggedInUser, user) =>{
    return user[0]?._id === loggedInUser?._id ? user[1].name : user[0].name
}
