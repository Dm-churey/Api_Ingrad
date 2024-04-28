const Router = require('express');
const router = new Router();
const multer = require('multer');
const checkAuth = require('../utils/checkAuth');
const db = require('../db'); // Путь к вашему файлу конфигурации базы данных

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

router.post('/', checkAuth, upload.single('image'), async (req, res) => {
  try {
    const id = req.userId; // Предполагается, что user_id доступен через req.user после проверки аутентификации
    const imagePath = `/uploads/${req.file.originalname}`;

    // Сохранение информации об изображении в базе данных
    const query = 'INSERT INTO images(user_id, image) VALUES($1, $2) RETURNING *';
    const values = [id, imagePath];
    const result = await db.query(query, values);

    res.json({ message: 'Изображение успешно загружено', imageId: result.rows[0].id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Не удалось загрузить изображение' });
  }
});

module.exports = router;

// const Router = require('express')
// const router = new Router()
// const multer = require('multer')
// const checkAuth = require('../utils/checkAuth')

// const storage = multer.diskStorage({
//     destination: (_, __, cb) => {
//         cb(null, 'uploads')
//     }, 
//     filename: (_, file, cb) => {
//         cb(null, file.originalname)
//     }, 
// })

// const upload = multer({storage})
// router.post('/', checkAuth, upload.single('image'), (req,res) => {
//     res.json({url: `/uploads/${req.file.originalname}`})
// })

// module.exports = router