const { failedLog } = require("../helpers/logger");

exports.create = function (req, res, next) {
    req.check('name')
        .notEmpty().withMessage('field is required')
        .isString().withMessage('must be string')
        .matches(/^[A-Za-z\s]+$/).withMessage('must be alphabetic')
        .isLength({min: 3, max: 30}).withMessage('length must between 3-30 characters');
    req.check('email')
        .notEmpty().withMessage('field is required')
        .isEmail().withMessage('must be valid email')
        .isLength({min: 8, max: 60}).withMessage('length must between 8-60 characters');
    req.check('password')
        .notEmpty().withMessage('field is required')
        .isLength({min: 6, max: 16}).withMessage('length must between 6-16 characters');
    respond(req, res, next);
}

exports.readAll = (req, res, next) => {
    req.check('index')
        .optional()
        .isInt({gt: -1}).withMessage('must be numeric start from 0');
    req.check('limit')
        .optional()
        .isInt({gt: 0}).withMessage('must be numeric start from 1');
    respond(req, res, next);
};

exports.readOne = function (req, res, next) {
    req.check('id')
        .notEmpty().withMessage('field is required')
        .isMongoId().withMessage('must be valid mongo id');
    respond(req, res, next);
}

exports.update = function (req, res, next) {
    req.check('id')
        .optional()
        .isMongoId().withMessage('must be valid mongo id');
    req.check('name')
        .optional()
        .isString().withMessage('must be string')
        .matches(/^[A-Za-z\s]+$/).withMessage('must be alphabetic')
        .isLength({min: 3, max: 30}).withMessage('length must between 3-30 characters');
    req.check('email')
        .optional()
        .isEmail().withMessage('must be valid email')
        .isLength({min: 8, max: 60}).withMessage('length must between 8-60 characters');
    req.check('password')
        .optional()
        .isLength({min: 6, max: 16}).withMessage('length must between 6-16 characters');
    respond(req, res, next);
}

exports.delete = function (req, res, next) {
    req.check('id')
        .notEmpty().withMessage('field is required')
        .isMongoId().withMessage('must be valid mongo id');
    respond(req, res, next);
}

function respond(req, res, next) {
    const err = req.validationErrors();
    if (err) {
        failedLog(req, res, {
            status: false,
            message: 'Error',
            debug: err,
            errResult: err
        });
    } else {
        next();
    }
}