// const db = require('../db')

// const userSchema = new db.Pool({
//     name: {
//         type: String,
//         required: true
//     },
//     lastname: {
//         type: String,
//         required: true
//     },
//     patronymic: {
//         type: String,
//         required: true
//     },
//     age: Number,
//     phone: {
//         type: Number,
//         required: true
//     },
//     login: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     passwordHash: {
//         type: String,
//         required: true
//     },
//     post: {
//         type: String,
//         required: true
//     },
// }, 
// {
//     timestamps: true
// })

// module.exports = db.Pool('Users', userSchema)