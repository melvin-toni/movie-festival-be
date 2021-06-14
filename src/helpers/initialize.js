const db = require("../models/db");

db.init().then(_ => {
    console.log('Initialize DB successful');
}).catch(error => {
    console.log('Initialize DB error >>', error);
});