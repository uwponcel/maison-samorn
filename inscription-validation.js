const validatePrenom = (prenom) => {
  return (
    typeof prenom === "string" &&
    prenom &&
    prenom.length >= 2 &&
    prenom.length <= 50
  );
};

const validateNom = (nom) => {
  return typeof nom === "string" && nom && nom.length >= 2 && nom.length <= 50;
};

const validateAdresse = (adresse) => {
  return (
    typeof adresse === "string" &&
    adresse &&
    adresse.length >= 5 &&
    adresse.length <= 100
  );
};

const validateCodePostal = (codePostal) => {
  let regex = /[ABCEGHJKLMNPRSTVXY][0-9][ABCEGHJKLMNPRSTVWXYZ] ?[0-9][ABCEGHJKLMNPRSTVWXYZ][0-9]/;
  return (
    typeof codePostal === "string" &&
    codePostal &&
    codePostal.length >= 7 &&
    codePostal.length <= 7 &&
    regex.test(codePostal)
  );
};

const validateCourriel = (courriel) => {
  let regex = /^[^ ]+@[^ ]+.[a-z]{2,6}$/;
  return (
    typeof courriel === "string" &&
    courriel &&
    courriel.length >= 5 &&
    courriel.length <= 50 &&
    regex.test(courriel)
  );
};

const validateMotDePasse = (motDePasse) => {
  return (
    typeof motDePasse === "string" &&
    motDePasse &&
    motDePasse.length >= 6 &&
    motDePasse.length <= 50
  );
};

exports.validateAll = (compte) => {
  console.log("===================Validation serveur===================");
  console.log("Prenom: " + validatePrenom(compte.prenom));
  console.log("Nom: " + validateNom(compte.nom));
  console.log("Adresse: " + validateAdresse(compte.adresse));
  console.log("Code postal: " + validateCodePostal(compte.codePostal));
  console.log("Courriel: " + validateCourriel(compte.courriel));
  console.log("Mot de passe: " + validateMotDePasse(compte.motDePasse));
  console.log("========================================================");
  return (
    validatePrenom(compte.prenom) &&
    validateNom(compte.nom) &&
    validateAdresse(compte.adresse) &&
    validateCodePostal(compte.codePostal) &&
    validateCourriel(compte.courriel) &&
    validateMotDePasse(compte.motDePasse)
  );
};
