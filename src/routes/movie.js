const router = require('express').Router();
const controller = require('../controllers/movie');
const multer = require("multer");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.env.PATH_UPLOADED_MOVIE);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage }).single('url');
// const validator = require('../validators/user');

router.get('/', controller.readAll);

router.post('/', /*validator.create,*/upload, controller.create);

router.patch('/:id', upload, controller.update);

module.exports = router;