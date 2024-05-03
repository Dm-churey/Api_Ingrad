const Router = require('express');
const router = new Router();
const multer = require('multer');
const checkAuth = require('../utils/checkAuth');
const db = require('../db');

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

router.patch('/', checkAuth, upload.single('image'), async (req, res) => {
  try {
    const id = req.userId;
    const imagePath = `/uploads/${req.file.originalname}`;

    // Сохранение информации об изображении в базе данных
    //const query = 'INSERT INTO images(user_id, image) VALUES($1, $2) RETURNING *';
    //const values = [id, imagePath];
    //const result = await db.query(query, values);
    const result = await db.query('UPDATE users SET image = $1 WHERE id = $2', [imagePath, id]);

    //res.json({ message: 'Изображение успешно загружено', imageId: result.rows[0].id });
    res.json({ message: 'Изображение успешно загружено' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Не удалось загрузить изображение' });
  }
}, (err, req, res, next) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Ошибка при загрузке файла: ' + err.message });
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