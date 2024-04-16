const db = require('../db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {validationResult} = require('express-validator')

class UserController{
    async createUser(req, res){ //Регистрация
        try {

            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json(errors.array())
            }

            const {name, lastname, patronymic, age, phone, login, password, post} = req.body
            const salt = await bcrypt.genSalt(10)
            const passwordHash = await bcrypt.hash(password, salt)
            const newPerson = await db.query('INSERT INTO users (name, lastname, patronymic, age, phone, login, password, post) values ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', [name, lastname, patronymic, age, phone, login, passwordHash, post])
            
            const token = jwt.sign({
                id: newPerson.rows[0].id
             }, 'secret123',
             {
                expiresIn: '365d'
             })

            await db.query('INSERT INTO sessions (token, user_id) values ($1, $2)', [token, newPerson.rows[0].id])
            
            const userData = { ...newPerson.rows[0]}
            delete userData.password;

            res.json({...userData, token})  
        } catch (err) {
            console.log(err)
            res.status(500).json({message: 'Не удалось зарегестрироваться'})
        }
    }

    async userLogin(req, res) { //Вход в аккаунт
        try {

            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json(errors.array())
            }

            const {login, password} = req.body
            const user = await db.query('SELECT * FROM users where login = $1', [login])
            if (!user.rows[0]) {
                return res.status(404).json({
                    message: 'Неверный логин или пароль'
                })
            }
            
            //const isValidPass = await db.query('SELECT * FROM users where password = $1', [password])
            //const salt = await bcrypt.genSalt(10)
            //const passwordHash = await bcrypt.hash(user.password, salt)
            const isValidPass = await bcrypt.compare(password, user.rows[0].password)
            if (!isValidPass) {
                return res.status(400).json({
                    message: 'Неверный логин или пароль'
                })
            }

            const token = jwt.sign({
                id: user.rows[0].id
             }, 'secret123',
             {
                expiresIn: '365d'
             })

            await db.query('INSERT INTO sessions (token, user_id) values ($1, $2)', [token, user.rows[0].id])
            
            const userData = { ...user.rows[0]}
            delete userData.password;
            
            res.json({...userData,  token, message: 'Вход выполнен'})

        } catch (err) {
            console.log(err)
            res.status(500).json({message: 'Не удалось авторизоваться'})
        }
    }

    async postAuth(req, res) { //Проверка существующей сессии, путем сравнения токена
        try {

            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json(errors.array())
            }

            const {token, user_id} = req.body
            const check = await db.query('SELECT * FROM sessions where token = $1 AND user_id = $2', [token, user_id])
            if (!check.rows[0]){
                return res.status(401).json({
                    message: 'Пользователь не авторизован'
                })
            } else {
                return res.status(200).json({
                    message: 'Пользователь авторизован'
                })
            }
        } catch (err) {
            console.log(err)
            res.status(500).json({message: 'Не удалось проверить авторизацию'})
        }
    }

    async deleteToken(req, res) { //Удаление токена при выходе из аккаунта
        try {
            const {token} = req.body
            const del = await db.query('DELETE FROM sessions where token = $1', [token])
            res.json(del.rows[0])
            // if (!del.rows[0]){
            //     return res.status(401).json({
            //         message: 'Сессия не удалена'
            //     })
            // } else {
            //     return res.status(200).json({
            //         message: 'Сессия удалена'
            //     })
            // }
        } catch (err) {
            console.log(err)
            res.status(500).json({message: 'Не удалось проверить сессию'})
        }
    }

    async getMe(req, res) { //Получение информации о себе
        try {
            const id = req.userId
            const user = await db.query('SELECT * FROM users where id = $1', [id])

            if (!user.rows[0]) {
                return res.status(404).json({message: 'Пользователь не найден'})
            }
            const {password, ...userData} = user.rows[0]
            res.json(userData)
        } catch (err) {
            console.log(err)
            res.status(500).json({message: 'Нет доступа'})
        }
    }

    async getDrivers(req, res) { //Получение информации о всех водителях
        try {
            const post = "водитель"
            const users = await db.query('SELECT id, lastname, name, patronymic FROM users WHERE post = $1', [post])
            if (users.rows == '') {
                return res.status(404).json({message: 'Водители не найдены'})
            }
            res.json(users.rows)
        } catch (err) {
            console.log(err)
            res.status(500).json({message: 'Ошибка'})
        }
    }

    async getUsers(req, res) { //Получение всех пользователей
        const users = await db.query('SELECT * FROM users')
        res.json(users.rows[0])
    }

    async getOneUser(req, res){ //Поиск пользователя по id
        const id = req.params.id
        const user = await db.query('SELECT * FROM users where id = $1', [id])
        res.json(user.rows[0])
    }

    async updateUser(req, res){ //Обновление данных о пользователе
        const id = req.params.id
        const {name, lastname, patronymic, age, phone, login, password, post} = req.body
        const user = await db.query(
            'UPDATE users set name = $1, lastname = $2, patronymic = $3, age = $4, phone = $5, login = $6, password = $7, post = $8 where id = $9 ',
            [name, lastname, patronymic, age, phone, login, password, post, id]
        )
        res.json(user.rows[0])
    }

    async deleteUser(req, res){ //Удаление пользователя из бд
        const id = req.params.id
        const user = await db.query('DELETE FROM users where id = $1', [id])
        res.json(user.rows[0])
    }
}

module.exports = new UserController()