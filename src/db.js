const mysql = require("mysql2/promise");

const connection = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "12qwaszx",
    database: "videojuegos"
});

module.exports = connection;
