const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

const db = async () => {
    return await open({
        filename: 'src/models/moviefestival.db',
        driver: sqlite3.Database
    });
};

// const init = async () => {
//     const con = await db();
//     await con.exec('DROP TABLE IF EXISTS booking_data');
//     await con.exec(
//         'CREATE TABLE booking_data(flight_no TEXT, adult INTEGER, child INTEGER, infant INTEGER)'
//     );
//     await con.exec('INSERT INTO booking_data VALUES("AF 123", 2, 0, 1)');
//     await con.exec('INSERT INTO booking_data VALUES("BE 782", 2, 1, 1)');
// };

// const getAll = async (flightNo) => {
exports.getAll = async (flightNo) => {
    const con = await db();
    const data = await con.all('SELECT * FROM booking_data WHERE flight_no = ?', flightNo);
    return data;
}
