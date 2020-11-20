// connection.js
let mysql = require("promise-mysql");

let connectionPromise = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "",
  database: "maison_samorn",
});

module.exports = connectionPromise;
