const Router = require('express')
const router = new Router()
const userController = require('../controllers/user_controller')
const {loginValidation, registerValidation} = require('../validations/validations')
const checkAuth = require('../utils/checkAuth')

router.post('/user/register', registerValidation, userController.createUser)
router.post('/user/login', loginValidation, userController.userLogin)
router.post('/user/checkauth', userController.postAuth)
router.delete('/user/delsession', userController.deleteToken)
router.get('/user/me', checkAuth, userController.getMe)
router.get('/user', userController.getUsers)
router.get('/user/drivers', userController.getDrivers)
router.get('/user/:id', userController.getOneUser)
router.patch('/user/:id', userController.updateUser)
router.delete('/user/:id', userController.deleteUser)

module.exports = router