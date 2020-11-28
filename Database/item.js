let connectionPromise = require("../connection");

exports.getAll = async () => {
  let connection = await connectionPromise;
  let results = await connection.query(
    "SELECT i.nom, i.categorie, i.image, i.prix, i.description FROM item i"
  );

  return results;
};
