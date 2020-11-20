let connectionPromise = require("../connection");

exports.get = async () => {
  let connection = await connectionPromise;
  let results = await connection.query(
    "SELECT c.courriel, c.mot_de_passe FROM compte c"
  );
  return results;
};
//signUpEmail
//signUpPassword
exports.add = async (
  idCompte,
  typeDeCompte,
  prenom,
  nom,
  adresse,
  codePostal,
  ville,
  courriel,
  motDePasse
) => {
  let connection = await connectionPromise;
  connection.query(
    `INSERT INTO compte(
            id_compte, 
            type_de_compte, 
            prenom, 
            nom, 
            adresse,
            code_postal,
            ville,
            courriel,
            mot_de_passe)
         VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      idCompte,
      typeDeCompte,
      prenom,
      nom,
      adresse,
      codePostal,
      ville,
      courriel,
      motDePasse,
    ]
  );
};
