const { body } = require('express-validator')

const loginValidation = [
    body('login').isEmail().withMessage('Неверный формат почты'),
    body('password').isLength({min: 5}).withMessage('Пароль должен быть минимум 5 символов')
]

const registerValidation = [
    body('name', 'Укажите имя').isLength({min: 3}),
    body('lastname', 'Укажите фамилию').isLength({min: 3}),
    body('patronymic', 'Укажите отчество').isLength({min: 3}),
    body('age', 'Укажите корректный возраст').optional().isLength({min: 2}),
    body('phone', 'Неправильный формат номера телефона').isLength({min: 11}),
    body('login', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен быть минимум 5 символов').isLength({min: 5}),
    body('post', 'Укажите должность').isLength({min: 5})
]

const applicationCreateValidation = [
    body('purpose', 'Укажите цель поездки').isLength({min: 3}),
    body('address', 'Укажите адрес поездки').isLength({min: 3}),
    body('date', 'Укажите дату поездки').isLength({min: 3}),
    body('start_time', 'Укажите время начала поездки').isLength({min: 2}),
    body('finish_time', 'Неправильный формат номера телефона').isLength({min: 2}),
    //body('user_id', 'Неверный формат почты').isInt(),
    //body('driver_id', 'Пароль должен быть минимум 5 символов').isLength({min: 5}),
    body('comment', 'Укажите место встречи с водителем').optional().isLength({min: 2})
]

const applicationApproveValidation = [
    body('driver_id', 'Выберите водителя').isLength({min: 1})
]

module.exports = {registerValidation, loginValidation, applicationCreateValidation, applicationApproveValidation}