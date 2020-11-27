const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const bodyParser = require("body-parser");
const serveStatic = require("serve-static");
const cors = require("cors");
const sse = require("./middleware-sse.js");
const item = require("./Database/item");
const compte = require("./Database/compte");

/** Port pour le serveur */
const PORT = process.env.PORT;

/** Création du serveur */
let app = express();

// Mettre des options différentes à Helmet en développement
let helmetOptions = null;
if (app.settings.env === "development") {
  helmetOptions = require("./developement-csp");
}

// Ajout de middlewares
app.use(helmet(helmetOptions));
app.use(compression());
app.use(cors());
app.use(bodyParser.json({ strict: false }));
app.use(serveStatic("./public"));
app.use(sse());
// Redirect, CSS bootstrap JS jQuery, bootstrap JS
app.use("/js", express.static(__dirname + "/node_modules/bootstrap/dist/js"));
app.use("/js", express.static(__dirname + "/node_modules/jquery/dist"));
app.use("/css", express.static(__dirname + "/node_modules/bootstrap/dist/css"));

// Ajouter vos routes ici
app.get("/item", async (request, response) => {
  let data = await item.getAll();
  response.status(200).json(data);
});

app.post("/compte", async (request, response) => {
  compte.add(
    request.body.idCompte,
    request.body.typeDeCompte,
    request.body.prenom,
    request.body.nom,
    request.body.adresse,
    request.body.codePostal,
    request.body.ville,
    request.body.email,
    request.body.motDePasse
  );
  response.sendStatus(200);
});

// Renvoyer une erreur 404 pour les routes non définies
app.use(function (request, response) {
  // Renvoyer simplement une chaîne de caractère indiquant que la page n'existe pas
  response.status(404).send(request.originalUrl + " not found.");
});

// Démarrage du serveur
app.listen(PORT);
