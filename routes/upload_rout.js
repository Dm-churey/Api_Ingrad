const Router = require('express')
const router = new Router()
const multer = require('multer')
const checkAuth = require('../utils/checkAuth')

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads')
    }, 
    filename: (_, file, cb) => {
        cb(null, file.originalname)
    }, 
})

const upload = multer({storage})
router.post('/', checkAuth, upload.single('image'), (req,res) => {
    res.json({url: `/uploads/${req.file.originalname}`})
})

module.exports = router