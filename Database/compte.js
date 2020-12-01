const pool = require("./pool");

exports.inscription = async (
  prenom,
  nom,
  adresse,
  codePostal,
  courriel,
  motDePasse
) => {

  let connection = await pool;
  return new Promise((resolve, reject) => {
    connection.query(
      `INSERT INTO compte(
                  prenom, 
                  nom, 
                  adresse,
                  code_postal,
                  courriel,
                  mot_de_passe)
                  VALUES(?, ?, ?, ?, ?, ?)`,
      [prenom, nom, adresse, codePostal, courriel, motDePasse],
      (err, rows) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY" || err.errno == 1062) {
            //TODO afficher dans le html
            resolve(1);
          }
        } else {
          resolve(2);
        }
      }
    );
  });
};

exports.connection = async (courriel, motDePasse) => {
  let connection = await pool;
  let results = await connection.query(
    `SELECT c.courriel, c.mot_de_passe, c.prenom
       FROM compte c
       WHERE c.courriel = ? 
       AND c.mot_de_passe = ?`,
    [courriel, motDePasse]
  );

  return results;
};