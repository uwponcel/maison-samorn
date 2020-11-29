//=============================================================================
// Require des middlewares + express
//=============================================================================
const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const bodyParser = require("body-parser");
const serveStatic = require("serve-static");
const cors = require("cors");
const sse = require("./middleware-sse.js");
const session = require("express-session");
const MemoryStore = require("memorystore")(session);

//=============================================================================
// Require custom
//=============================================================================
const item = require("./Database/item");
const compte = require("./Database/compte");
const validation = require("./is-compte-valid");
// //* String si le compte existe déjà avec le unique courriel dans la DB.

//=============================================================================
// Port pour le serveur
//=============================================================================
const PORT = process.env.PORT;

//=============================================================================
// Création du serveur
//=============================================================================
let app = express();

//=============================================================================
// Mettre des options différentes à Helmet en développement
//=============================================================================
let helmetOptions = null;
if (app.settings.env === "development") {
  helmetOptions = require("./developement-csp");
}

//=============================================================================
// Ajout de middlewares
//=============================================================================
app.use(helmet(helmetOptions));
app.use(compression());
app.use(cors());
app.use(bodyParser.json({ strict: false }));
app.use(serveStatic("./public"));
app.use(sse());
app.use(
  session({
    cookie: { maxAge: 3600000 },
    name: process.env.npm_package_name,
    store: new MemoryStore({ checkPeriod: 3600000 }), //1 heure
    resave: false,
    secret: "mot de passe infaillible",
  })
);

// Redirect, CSS bootstrap JS jQuery, bootstrap JS
app.use("/js", express.static(__dirname + "/node_modules/jquery/dist"));
app.use("/js", express.static(__dirname + "/node_modules/popper.js/dist/umd"));
app.use("/js", express.static(__dirname + "/node_modules/bootstrap/dist/js"));
app.use("/css", express.static(__dirname + "/node_modules/bootstrap/dist/css"));

//=============================================================================
// Routes serveur
//=============================================================================
//* Route pour aller chercher les items du menu.
app.get("/item", async (request, response) => {
  let data = await item.getAll();
  response.status(200).json(data);
});

//* Route pour ajouter un compte client.
app.post("/compte", async (request, response) => {
  if (!validation.validateAll(request.body)) {
    response.sendStatus(400);
    return;
  } else {
    compte.add(
      request.body.prenom,
      request.body.nom,
      request.body.adresse,
      request.body.codePostal,
      request.body.courriel,
      request.body.motDePasse
    );
    response.sendStatus(200);
    // if (erreur) {
    //   response.sendStatus(409);
    // } else {
    //   response.sendStatus(200);
    // }

    //TODO afficher dans le html
    // let compteExiste = compte.compteExiste();
  }
  //
});

// Renvoyer une erreur 404 pour les routes non définies
app.use(function (request, response) {
  // Renvoyer simplement une chaîne de caractère indiquant que la page n'existe pas
  response.status(404).send(request.originalUrl + " not found.");
});

//=============================================================================
// Démarage du serveur
//=============================================================================
app.listen(PORT);
