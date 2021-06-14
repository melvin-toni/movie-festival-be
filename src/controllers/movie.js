const TAG = "controllers.movie";
const db = require("../models/db");
const {
    traceLog,
    successLog,
    failedLog
} = require("../helpers/logger");

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