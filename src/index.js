const env = require('dotenv');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const chalk = require('chalk');
const sqlite3 = require('sqlite3');
const path = require('path');
const expressJwt = require('express-jwt');
const fs = require('fs');
const RSA_PUBLIC_KEY = fs.readFileSync('jwtRS256.key.pub', 'utf8');
const {
	failedLog
} = require("./helpers/logger");

// add the list of routes here
const authRoutes = require('./routes/auth');
const movieRoutes = require('./routes/movie');

const envPath = 'environments/.env.development'
env.config({
    debug: process.env.DEBUG,
    path: envPath
});

const dbPath = path.resolve(__dirname, 'models/moviefestival.db')
new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.log(chalk.red('✘'), `DB connection error ${err.message}`);
    } else {
        console.log(chalk.green('✓'), 'DB connection established');
    }
});

const app = express();
app.use(cors({origin: true, credentials: true}));
app.set('host', process.env.HOST || 'localhost');
app.set('port', process.env.PORT || 8000);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(expressValidator());

app.use(expressJwt({
    secret: RSA_PUBLIC_KEY,
    algorithms: ['RS256'],
    getToken: function fromHeaderOrQuerystring(req) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            return req.headers.authorization.split(' ')[1];
        } else if (req.query && req.query.token) {
            return req.query.token;
        }
        return null;
    }
}).unless({
    // add route here to exclude API from token auth check
    path: [
        '/api/auth/login',
        '/api/user/register',
        '/api/movie/search',
        '/api/movie/most-viewed-genre'
    ]
}), (error, req, res, next) => {
    if (error) { 
        failedLog(req, res, {
            status: false, message: error.message, debug: error
        });
    }
});

// add the list of API's here
app.use('/api/auth', authRoutes);
app.use('/api/movie', movieRoutes);

app.listen(app.get('port'), () => {
    console.log('%s App is running at %s:%d in %s mode', chalk.green('✓'), app.get('host'), app.get('port'), app.get('env'));
});
module.exports = app;