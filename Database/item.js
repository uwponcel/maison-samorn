const pool = require("./pool");

exports.getAll = async () => {
  let connection = await pool;
  let results = await connection.query(
    "SELECT i.nom, i.categorie, i.image, i.prix, i.description FROM item i"
  );

  return results;
};
