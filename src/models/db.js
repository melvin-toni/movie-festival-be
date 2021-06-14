const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const { nanoid } = require("nanoid");

const db = async () => {
    return await open({
        filename: 'src/models/moviefestival.db',
        driver: sqlite3.Database
    });
};

exports.init = async () => {
    const con = await db();
    await con.exec('DROP TABLE IF EXISTS movies');
    await con.exec(
        'CREATE TABLE movies(id TEXT, title TEXT, description TEXT, duration INTEGER, artists TEXT, genres TEXT, url TEXT)'
    );
}

exports.createMovie = async (prm) => {
    const con = await db();
    const data = await con.run('INSERT INTO movies (id, title, description, duration, artists, genres, url) VALUES (?, ?, ?, ?, ?, ?, ?)',
        nanoid(process.env.ID_LENGTH),
        prm.title,
        prm.description,
        prm.duration,
        prm.artists,
        prm.genres,
        prm.url);
    return data;
}
