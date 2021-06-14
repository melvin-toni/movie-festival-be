const TAG = "controllers.movie";
const db = require("../models/db");
const {
    traceLog,
    successLog,
    failedLog
} = require("../helpers/logger");

exports.readAll = async (req, res) => {
    traceLog(`${TAG} >> readAll`);

    try {
        let prm = {};
        let msg = 'Data is empty';
        
        if (req.query.sorted_by) {
            prm['sortedBy'] = req.query.sorted_by;
        }

        const data = await db.readAllMovie(prm);

        if (data.length > 0)
            msg = 'Movie read success';

        successLog(req, res, {
            status: true,
            message: msg,
            result: data
        });
    } catch (error) {
        failedLog(req, res, {
            status: false,
            message: 'Movie read failed',
            debug: error
        });
    }
}

exports.create = async (req, res) => {
    traceLog(`${TAG} >> create`);

    try {
        const prmInsert = {
            title: req.body.title,
            description: req.body.description,
            duration: req.body.duration,
            artists: req.body.artists,
            genres: req.body.genres,
            url: req.file.path,
        }

        const data = await db.createMovie(prmInsert);
        if (data.changes === 1) {
            successLog(req, res, {
                status: true,
                message: 'Movie insert success'
            });
        } else {
            failedLog(req, res, {
                status: false,
                message: 'Movie insert failed',
                debug: 'Data not inserted'
            });
        }
    } catch (error) {
        failedLog(req, res, {
            status: false,
            message: 'Movie insert failed',
            debug: error
        });
    }
}

exports.update = async (req, res) => {
    traceLog(`${TAG} >> update`);

    try {
        const prmUpdate = {
            id: req.params.id,
            title: req.body.title,
            description: req.body.description,
            duration: req.body.duration,
            artists: req.body.artists,
            genres: req.body.genres,
            url: req.file.path,
        }

        const data = await db.updateMovie(prmUpdate);

        if (data.changes === 1) {
            successLog(req, res, {
                status: true,
                message: 'Movie update success'
            });
        } else {
            failedLog(req, res, {
                status: false,
                message: 'Movie update failed',
                debug: 'Data not updated'
            });
        }
    } catch (error) {
        failedLog(req, res, {
            status: false,
            message: 'Movie update failed',
            debug: error
        });
    }
}