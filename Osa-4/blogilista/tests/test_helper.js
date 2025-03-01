const User = require('../models/user')

const initialBlogs = [
    {
    _id: "6798ffdff19a0f548d8258ab",
    title:"testing",
    author:"rootUser",
    url:"localhost",
    likes:"3",
    __v:"0"
    },
    {
    _id: "67a21a7247cc459c4381aa21",
    title:"testing",
    author:"rootUser",
    url:"localhost",
    likes:"2",
    __v:"0"
    }
]

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

module.exports = { 
    initialBlogs,
    usersInDb
 }