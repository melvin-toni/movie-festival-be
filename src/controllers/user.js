const TAG = "controllers.user";
// const UserModel = require("../models/db");
const db = require("../models/db");
const {
    traceLog,
    successLog,
    failedLog
} = require("../helpers/logger");

exports.create = async (req, res) => {
    traceLog(`${TAG} >> test`);

    console.log(JSON.stringify(await db.getAll('AF 123')));
    successLog(req, res, {
        status: true,
        message: 'Read user successfully',
        result: await db.getAll('AF 123')
    });
}

exports.readAll = (req, res) => {
    traceLog(`${TAG} >> readAll`);

    let _limit = parseInt(req.query.limit) ? parseInt(req.query.limit) * 1 : 10;
    let _skip = parseInt(req.query.index) ? parseInt(req.query.index) * _limit : 0;
    const excludeField = {
        'password': 0,
        '__v': 0
    }
    const pagination = {
        skip: _skip, limit: _limit
    };

    UserModel.find({}, excludeField, pagination).then((doc) => {
        successLog(req, res, {
            status: true,
            message: 'Read user successfully',
            result: doc
        });
    }).catch((err) => {
        failedLog(req, res, {
            status: false,
            message: 'Read user failed',
            debug: err
        });
    });
}

exports.readOne = (req, res) => {
    traceLog(`${TAG} >> readOne`);

    const query = { '_id': req.params.id };
    const excludeField = {
        'password': 0,
        '__v': 0
    }

    UserModel.findOne(query, excludeField).then((doc) => {
        successLog(req, res, {
            status: true,
            message: 'Read user successfully',
            result: doc
        });
    }).catch((err) => {
        failedLog(req, res, {
            status: false,
            message: 'Read user failed',
            debug: err
        });
    });
}

exports.update = (req, res) => {
    traceLog(`${TAG} >> update`);

    const query = { '_id': req.params.id };

    let UPDATE_DOC = {};
    req.body.name ? (UPDATE_DOC['name'] = req.body.name) : '';
    req.body.email ? (UPDATE_DOC['email'] = req.body.email) : '';
    req.body.password ? (UPDATE_DOC['password'] = req.body.password) : '';

    const queryOptions = {
        new: true
    }

    UserModel.findOneAndUpdate(query, UPDATE_DOC, queryOptions).then((doc) => {
        successLog(req, res, {
            status: true,
            message: 'Update user successfully',
            result: doc
        });
    }).catch((err) => {
        failedLog(req, res, {
            status: false,
            message: 'Update user failed',
            debug: err
        });
    });
}

exports.delete = (req, res) => {
    traceLog(`${TAG} >> delete`);

    const query = { _id: req.params.id };

    const queryOptions = {
        new: true
    }

    UserModel.findOneAndUpdate(query, { 'is_deleted': true }, queryOptions).then((doc) => {
        successLog(req, res, {
            status: true,
            message: 'Delete user successfully'
        });
    }).catch((err) => {
        failedLog(req, res, {
            status: false,
            message: 'Delete user failed',
            debug: err
        });
    });
}