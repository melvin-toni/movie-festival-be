const router = require('express').Router();
const controller = require('../controllers/auth');
// const validator = require('../validators/auth');

router.post('/login', validator.login, controller.login);

module.exports = router;