const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const bodyParser = require("body-parser");
const serveStatic = require("serve-static");
const cors = require("cors");
const sse = require("./middleware-sse.js");

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

// Ajouter vos routes ici

// Renvoyer une erreur 404 pour les routes non définies
app.use(function (request, response) {
  // Renvoyer simplement une chaîne de caractère indiquant que la page n'existe pas
  response.status(404).send(request.originalUrl + " not found.");
});

// Démarrage du serveur
app.listen(PORT);
