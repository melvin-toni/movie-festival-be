const env = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const chalk = require('chalk');
const sqlite3 = require('sqlite3');
const path = require('path');

// add the list of routes here
const userRoutes = require('./routes/user');

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
app.set('host', process.env.HOST || 'localhost');
app.set('port', process.env.PORT || 8000);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(expressValidator());

// add the list of API's here
app.use('/api/user', userRoutes);

app.listen(app.get('port'), () => {
    console.log('%s App is running at %s:%d in %s mode', chalk.green('✓'), app.get('host'), app.get('port'), app.get('env'));
});
module.exports = app;