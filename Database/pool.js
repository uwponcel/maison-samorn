// connection.js
const mysql = require("promise-mysql");

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "",
  database: "maison_samorn",
});

module.exports = pool;
