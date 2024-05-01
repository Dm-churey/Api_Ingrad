const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
//const db = require('./db')
//const {validationResult} = require('express-validator')

const userRouter = require('./routes/user_rout')
const applicationRouter = require('./routes/application_rout')
const uploadRouter = require('./routes/upload_rout')
//const {registerValidation} = require('./validations/auth')
//const userModel = require('./models/user')

const PORT = process.env.PORT || 8080

const app = express()

app.use(express.json())
app.use('/api', userRouter)
app.use('/appl', applicationRouter)
app.use('/uploads', express.static('uploads'))
app.use('/upload', uploadRouter)


// app.get('/', (req, res) => {
//     res.send('HELLOW POSTGRES + NODEJS!!!')
// })

app.listen(PORT, (err) => {
    if (err) {
        return console.log(err)
    }
    
    console.log(`Server started on port ${PORT}`)
})