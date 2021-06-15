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

router.get('/', controller.readAll);
router.get('/most-viewed-genre', controller.readPopularGenre);

router.post('/', upload, controller.create);
router.post('/search', controller.search);

router.patch('/:id', upload, controller.update);
router.patch('/:id/track-viewership', controller.trackViewership);

module.exports = router;