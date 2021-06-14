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
    await con.exec('DROP TABLE IF EXISTS genres');
    // MOVIES
    await con.exec(
        'CREATE TABLE movies(id TEXT, title TEXT, description TEXT, duration INTEGER, artists TEXT, genres TEXT, url TEXT, viewed INTEGER)'
    );
    await con.exec(
        `INSERT INTO movies VALUES("${nanoid(process.env.ID_LENGTH)}", "Avengers: Infinity War", "Superheroes versus mighty Thanos", 180, "Robert Downey Jr.", "action", "public\\movies\\avenger.mkv", 100)`
    );
    await con.exec(
        `INSERT INTO movies VALUES("${nanoid(process.env.ID_LENGTH)}", "Braveheart", "Rebel against tyranny", 120, "Mel Gibson", "action", "public\\movies\\braveheart.mkv", 80)`
    );
    await con.exec(
        `INSERT INTO movies VALUES("${nanoid(process.env.ID_LENGTH)}", "Coco", "Musician ghost wandering", 130, "Anthony Gonzalez", "comedy", "public\\movies\\coco.mkv", 99)`
    );
    await con.exec(
        `INSERT INTO movies VALUES("${nanoid(process.env.ID_LENGTH)}", "Double Date", "Dating with their twin", 99, "Mia Ami", "romance", "public\\movies\\dd.mkv", 60)`
    );
    await con.exec(
        `INSERT INTO movies VALUES("${nanoid(process.env.ID_LENGTH)}", "Energy Love", "With love come great energy", 110, "Peter Parkour", "romance", "public\\movies\\energylove.mkv", 40)`
    );
    await con.exec(
        `INSERT INTO movies VALUES("${nanoid(process.env.ID_LENGTH)}", "Fufu Land", "Stranded in comedic land", 140, "Jack Dawson", "comedy", "public\\movies\\fufu.mkv", 98)`
    );
    await con.exec(
        `INSERT INTO movies VALUES("${nanoid(process.env.ID_LENGTH)}", "G.I. Joe", "Super heroes will save the day", 180, "Lee Kwang", "action", "public\\movies\\gijoe.mkv", 102)`
    );
    // GENRES
    await con.exec('CREATE TABLE genres(name TEXT, viewed INTEGER)');
    await con.exec('INSERT INTO genres VALUES("action", 52)');
    await con.exec('INSERT INTO genres VALUES("comedy", 89)');
    await con.exec('INSERT INTO genres VALUES("romance", 78)');
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

    query = query.concat(` LIMIT ${prm.limit} OFFSET ${prm.offset}`);

    const data = await con.all(query);
    return data;
}

exports.readPopularGenre = async () => {
    const con = await db();

    let query = 'SELECT * FROM genres ORDER BY viewed DESC';

    const data = await con.all(query);
    return data;
}