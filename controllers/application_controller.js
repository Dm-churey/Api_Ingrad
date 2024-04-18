const db = require('../db')
const {validationResult} = require('express-validator')

class AplicationController {
    async createAppl(req, res) { //Создание новой заявки
        try {
            
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json(errors.array())
            }

            const {purpose, address, date, start_time, finish_time, comment} = req.body
            const approve = 'false'
            const status = 'В обработке'
            const user_id = req.userId
            const newApplication = await db.query('INSERT INTO application (purpose, address, date, start_time, finish_time, user_id, comment, approve, status) values ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *', [purpose, address, date, start_time, finish_time, user_id, comment, approve, status])
            
            res.json(newApplication.rows[0])

        } catch (err) {
            console.log(err)
            res.status(500).json({message: 'Не удалось создать заявку'}) 
        }
    }

    // async getMyAppl2(req, res) { //Получение всех созданных заявок по id заказчика
    //     try {
    //         //const {id} = req.body
    //         const id = req.params.id
    //         const applications = await db.query("SELECT application.*, to_char(date, 'DD-MM-YYYY') AS date, to_char(created_at, 'DD-MM-YYYY HH24:MI:SS') AS created_at, users.id AS user_id, users.name AS user_name, users.lastname AS user_lastname, users.patronymic AS user_patronymic FROM application INNER JOIN users ON application.user_id = users.id WHERE user_id = $1", [id])
    //         res.json(applications.rows)
    //     } catch (err) {
    //         console.log(err)
    //         res.status(500).json({message: 'Не удалось получить заявки'})
    //     }
    // }

    async getMyAppl(req, res) { //Получение согласованных заявок заказчиком с заданным id
        try {
            const id = req.params.id
            const applications = await db.query("SELECT a.*, to_char(a.date, 'DD-MM-YYYY') AS date, to_char(a.created_at, 'DD-MM-YYYY HH24:MI:SS') AS created_at, u.name AS user_name, u.lastname AS user_lastname, u.patronymic AS user_patronymic, d.name AS driver_name, d.lastname AS driver_lastname, d.patronymic AS driver_patronymic FROM application a JOIN users u ON a.user_id = u.id JOIN users d ON a.driver_id = d.id WHERE a.approve = TRUE AND a.user_id = $1", [id])
            //const applications = await db.query("SELECT a.*, ai.purpose, ai.address, ai.date, ai.start_time, ai.finish_time, ai.user_id, ai.comment, u.name AS user_name, u.lastname AS user_lastname, u.patronymic AS user_patronymic, d.name AS driver_name, d.lastname AS driver_lastname, d.patronymic AS driver_patronymic, to_char(ai.date, 'DD-MM-YYYY') AS date, to_char(a.created_at, 'DD-MM-YYYY HH24:MI:SS') AS created_at FROM applications a JOIN application_items ai ON a.appl_items_id = ai.id JOIN  users d ON a.driver_id = d.id JOIN users u ON ai.user_id = u.id WHERE user_id = $1", [id])
            if (applications.rows == '') {
                return res.status(404).json({message: 'Нет согласованных заявок для данного пользователя'})
            }
            res.json(applications.rows)
        } catch (err) {
            console.log(err)
            res.status(500).json({message: 'Не удалось получить заявки'})
        }
    }

    async getApplDriver(req, res) { //Получение согласованных заявок назначеным водителем с заданным id
        try {
            const id = req.params.id
            const applications = await db.query("SELECT a.*, to_char(a.date, 'DD-MM-YYYY') AS date, to_char(a.created_at, 'DD-MM-YYYY HH24:MI:SS') AS created_at, u.name AS user_name, u.lastname AS user_lastname, u.patronymic AS user_patronymic, d.name AS driver_name, d.lastname AS driver_lastname, d.patronymic AS driver_patronymic FROM application a JOIN users u ON a.user_id = u.id JOIN users d ON a.driver_id = d.id WHERE a.approve = TRUE AND a.driver_id = $1", [id])
            //const applications = await db.query("SELECT a.*, ai.purpose, ai.address, ai.date, ai.start_time, ai.finish_time, ai.user_id, ai.comment, u.name AS user_name, u.lastname AS user_lastname, u.patronymic AS user_patronymic, d.name AS driver_name, d.lastname AS driver_lastname, d.patronymic AS driver_patronymic, to_char(ai.date, 'DD-MM-YYYY') AS date, to_char(a.created_at, 'DD-MM-YYYY HH24:MI:SS') AS created_at FROM applications a JOIN application_items ai ON a.appl_items_id = ai.id JOIN  users d ON a.driver_id = d.id JOIN users u ON ai.user_id = u.id WHERE user_id = $1", [id])
            if (applications.rows == '') {
                return res.status(404).json({message: 'Нет согласованных заявок для данного пользователя'})
            }
            res.json(applications.rows)
        } catch (err) {
            console.log(err)
            res.status(500).json({message: 'Не удалось получить заявки'})
        }
    }

    async getNewApplBoss(req, res) { //Получение новых заявок начальником для их обработки
        try {
            //const applications = await db.query("SELECT application_items.*, to_char(date, 'DD-MM-YYYY') AS date, to_char(created_at, 'DD-MM-YYYY HH24:MI:SS') AS created_at, users.id AS user_id, users.name AS user_name, users.lastname AS user_lastname, users.patronymic AS user_patronymic FROM application_items INNER JOIN users ON application_items.user_id = users.id")
            const applications = await db.query("SELECT a.id, a.purpose, a.address, a.date, a.start_time, a.finish_time, a.user_id, a.comment, a.approve, a.status, a.created_at, to_char(date, 'DD-MM-YYYY') AS date, to_char(created_at, 'DD-MM-YYYY HH24:MI:SS') AS created_at, u.name AS user_name, u.lastname AS user_lastname, u.patronymic AS user_patronymic FROM application a JOIN users u ON a.user_id = u.id WHERE a.approve = FALSE")
            if (applications.rows == '') {
                return res.status(404).json({message: 'Нет согласованных заявок для данного пользователя'})
            }
            res.json(applications.rows)
        } catch (err) {
            console.log(err)
            res.status(500).json({message: 'Не удалось получить заявки'})
        }
    }

    // async approveAppl(req,res) { //выбор водителя для утверждения заявки
    //     try {

    //         const errors = validationResult(req)
    //         if (!errors.isEmpty()) {
    //             return res.status(400).json(errors.array())
    //         }

    //         const {id, driver_id} = req.body
    //         const status = 'Согласовано'
    //         const application = await db.query('INSERT INTO applications (appl_items_id, driver_id, status) values ($1, $2, $3) RETURNING *', [id, driver_id, status])
    //         res.json(application.rows[0])
            
    //     } catch (err) {
    //         console.log(err)
    //         res.status(500).json({message: 'Не удалось согласовать заявку'})
    //     }
    // }

    async getAllApplBoss(req, res) { // Получение согласованных заявок начальником
        try {
            //const applications = await db.query("SELECT a.*, ai.purpose, ai.address, ai.date, ai.start_time, ai.finish_time, ai.user_id, ai.comment, u.name AS user_name, u.lastname AS user_lastname, u.patronymic AS user_patronymic, d.name AS driver_name, d.lastname AS driver_lastname, d.patronymic AS driver_patronymic, to_char(ai.date, 'DD-MM-YYYY') AS date, to_char(a.created_at, 'DD-MM-YYYY HH24:MI:SS') AS created_at FROM applications a JOIN application_items ai ON a.appl_items_id = ai.id JOIN  users d ON a.driver_id = d.id JOIN users u ON ai.user_id = u.id")
            const applications = await db.query("SELECT a.*, to_char(date, 'DD-MM-YYYY') AS date, to_char(created_at, 'DD-MM-YYYY HH24:MI:SS') AS created_at, u.name AS user_name, u.lastname AS user_lastname, u.patronymic AS user_patronymic, d.name AS driver_name, d.lastname AS driver_lastname, d.patronymic AS driver_patronymic FROM application a JOIN users u ON a.user_id = u.id JOIN users d ON a.driver_id = d.id WHERE a.approve = TRUE")
            if (applications.rows == '') {
                return res.status(404).json({message: 'Нет согласованных заявок для данного пользователя'})
            }
            res.json(applications.rows)
        } catch (err) {
            console.log(err)
            res.status(500).json({message: 'Не удалось получить заявки'})
        }
    }

    async getOneAppl(req, res) {
        try {
            const id = req.params.id
            const applications = await db.query("SELECT *, to_char(date, 'DD-MM-YYYY') AS date, to_char(created_at, 'DD-MM-YYYY HH24:MI:SS') AS created_at FROM application where id = $1", [id])
            res.json(applications.rows[0])
        } catch (err) {
            console.log(err)
            res.status(500).json({message: 'Не удалось получить заявку'})
        }
    }

    async approveAppl(req,res) { //выбор водителя для утверждения заявки
        try {

            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json(errors.array())
            }

            const id = req.params.id
            const {driver_id} = req.body
            const status = 'Согласовано'
            const approve = 'true'
            const application = await db.query('UPDATE application SET approve = $1, driver_id = $2, status = $3 WHERE id = $4 RETURNING *',
            [approve, driver_id, status, id])
            res.json(application.rows[0])
            
        } catch (err) {
            console.log(err)
            res.status(500).json({message: 'Не удалось согласовать заявку'})
        }
    }

    async updateAppl (req, res) {
        try {
            const id = req.params.id
            const {purpose, address, date, start_time, finish_time, user_id, comment} = req.body
            const appl = await db.query('UPDATE application SET purpose = $1, address = $2, date = $3, start_time = $4, finish_time = $5, user_id = $6, comment = $7 WHERE id = $8 RETURNING *',
            [purpose, address, date, start_time, finish_time, user_id, comment, id])

            res.json({success: true})
        } catch (err) {
            console.log(err)
            res.status(500).json({message: 'Не удалось обновить заявку'})
        }
    }

    async deleteAppl(req, res){
        try {
            const id = req.params.id
            const appl = await db.query('DELETE FROM application where id = $1 RETURNING *', [id])
            if (appl.rows.length === 0) {
                return res.status(404).json({message: 'Заявка не найдена'})
            }
            
            res.json({success: true})
            
        } catch (err) {
            console.log(err)
            return res.status(500).json({message: 'Не удалось удалить заявку'})
        }
    }

}

module.exports = new AplicationController()