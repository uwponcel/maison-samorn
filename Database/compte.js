const pool = require("./pool");

exports.add = async (
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
            resolve(true);
          }
        }
      }
    );
  });
};