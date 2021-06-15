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
    await con.exec('DROP TABLE IF EXISTS users');
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
    // USERS
    await con.exec('CREATE TABLE users(email TEXT, password TEXT, role TEXT)');
    await con.exec('INSERT INTO users VALUES("andy@example.com", "$2b$10$db8MSDtyESc.i7TmLv3aIO7iwYgu1mEU21hZ5enBgM1VWTykP5.5O", "admin")');
    await con.exec('INSERT INTO users VALUES("bernard@example.com", "$2b$10$db8MSDtyESc.i7TmLv3aIO7iwYgu1mEU21hZ5enBgM1VWTykP5.5O", "common_user")');
    await con.exec('INSERT INTO users VALUES("charlie@example.com", "$2b$10$db8MSDtyESc.i7TmLv3aIO7iwYgu1mEU21hZ5enBgM1VWTykP5.5O", "common_user")');
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

    if (prm.title) {
        query = query.concat(` WHERE title LIKE "%${prm.title}%"`);
    } else if (prm.description) {
        query = query.concat(` WHERE description LIKE "%${prm.description}%"`);
    } else if (prm.artists) {
        query = query.concat(` WHERE artists LIKE "%${prm.artists}%"`);
    } else if (prm.genres) {
        query = query.concat(` WHERE genres LIKE "%${prm.genres}%"`);
    }

    if (prm.sortedBy === 'most_viewed')
        query = query.concat(' ORDER BY viewed DESC');

    if (prm.limit) {
        query = query.concat(` LIMIT ${prm.limit} OFFSET ${prm.offset}`);
    }

    const data = await con.all(query);
    return data;
}

exports.readPopularGenre = async () => {
    const con = await db();

    let query = 'SELECT * FROM genres ORDER BY viewed DESC';

    const data = await con.all(query);
    return data;
}

exports.readOneMovie = async (prm) => {
    const con = await db();
    const data = await con.get('SELECT * FROM movies WHERE id = ?', prm.id);
    return data;
}

exports.readOneGenre = async (prm) => {
    const con = await db();
    const data = await con.get('SELECT * FROM genres WHERE name = ?', prm.genres);
    return data;
}

exports.trackViewership = async (prm) => {
    const con = await db();
    
    let data = await con.run('UPDATE movies SET viewed=? WHERE id = ?',
        prm.movie_viewed,
        prm.id);

    data = await con.run('UPDATE genres SET viewed=? WHERE name = ?',
        prm.genre_viewed,
        prm.genre_name);

    return data;
}

exports.readOneUser = async (prm) => {
    const con = await db();
    const data = await con.get('SELECT * FROM users WHERE email = ?', prm.email);
    return data;
}