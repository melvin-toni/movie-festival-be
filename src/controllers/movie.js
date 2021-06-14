const TAG = "controllers.movie";
const db = require("../models/db");
const {
    traceLog,
    successLog,
    failedLog
} = require("../helpers/logger");

exports.readAll = async (req, res) => {
    traceLog(`${TAG} >> readAll`);

    const _limit = parseInt(req.query.limit) ? parseInt(req.query.limit) * 1 : 5;
    const _offset = parseInt(req.query.index) ? parseInt(req.query.index) * _limit : 0;

    try {
        let prm = {
            limit: _limit,
            offset: _offset
        };
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
            result: {
                page: (req.query.index ? parseInt(req.query.index) + 1 : 1),
                data: data
            }
        });
    } catch (error) {
        failedLog(req, res, {
            status: false,
            message: 'Movie read failed',
            debug: error
        });
    }
}

exports.readPopularGenre = async (req, res) => {
    traceLog(`${TAG} >> readPopularGenre`);

    try {
        let msg = 'Data is empty';

        const data = await db.readPopularGenre();

        if (data.length > 0)
            msg = 'Genre read success';

        successLog(req, res, {
            status: true,
            message: msg,
            result: data
        });
    } catch (error) {
        failedLog(req, res, {
            status: false,
            message: 'Genre read failed',
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