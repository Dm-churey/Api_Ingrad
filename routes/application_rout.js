const Router = require('express')
const router = new Router()
const applicationController = require('../controllers/application_controller')
const {applicationCreateValidation, applicationApproveValidation} = require('../validations/validations')
const checkAuth = require('../utils/checkAuth')

router.get('/applications', checkAuth, applicationController.getAllApplBoss)
router.get('/applications/:id', applicationController.getOneAppl)
router.get('/applications/my/:id', applicationController.getMyAppl)
router.get('/applications/driver/:id', applicationController.getApplDriver)
router.get('/applications/new/boss', checkAuth, applicationController.getNewApplBoss)
//router.post('/applications/approve', applicationApproveValidation, applicationController.approveAppl)
router.post('/applications', checkAuth, applicationCreateValidation, applicationController.createAppl)
router.patch('/applications/approve/:id', checkAuth, applicationController.approveAppl)
router.patch('/applications/:id', checkAuth, applicationController.updateAppl)
router.delete('/applications/:id', checkAuth, applicationController.deleteAppl)

module.exports = router