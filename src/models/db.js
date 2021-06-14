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
        'CREATE TABLE movies(id TEXT, title TEXT, description TEXT, duration INTEGER, artists TEXT, genres TEXT, url TEXT, viewed INTEGER)'
    );
}

exports.createMovie = async (prm) => {
    const con = await db();
    const data = await con.run('INSERT INTO movies (id, title, description, duration, artists, genres, url, viewed) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        nanoid(process.env.ID_LENGTH),
        prm.title,
        prm.description,
        prm.duration,
        prm.artists,
        prm.genres,
        prm.url,
        0);
    return data;
}

exports.updateMovie = async (prm) => {
    const con = await db();
    const data = await con.run('UPDATE movies SET title=?, description=?, duration=?, artists=?, genres=?, url=? WHERE id = ?',
        prm.title,
        prm.description,
        prm.duration,
        prm.artists,
        prm.genres,
        prm.url,
        prm.id);
    return data;
}

exports.readAllMovie = async (prm) => {
    const con = await db();

    let query = 'SELECT * FROM movies';

    if (prm.sortedBy === 'most_viewed')
        query = query.concat(' ORDER BY viewed DESC');
        
    const data = await con.all(query);
    return data;
}