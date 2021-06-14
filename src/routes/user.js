const router = require('express').Router();
const controller = require('../controllers/user');
const validator = require('../validators/user');

router.post('/', /*validator.create,*/ controller.create);
router.get('/', validator.readAll, controller.readAll);
router.get('/:id', validator.readOne, controller.readOne);
router.put('/:id', validator.delete, controller.delete);

module.exports = router;