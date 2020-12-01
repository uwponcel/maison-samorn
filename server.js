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
const validation = require("./inscription-validation");


// my collection of custom exceptions
// const { catch } = require("./Database/pool.js");
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
app.use(bodyParser.json({
  strict: false
}));
app.use(serveStatic("./public"));
app.use(sse());
app.use(
  session({
    cookie: {
      maxAge: 3600000
    },
    name: process.env.npm_package_name,
    store: new MemoryStore({
      checkPeriod: 3600000
    }), //1 heure
    resave: false,
    secret: "mot de passe infaillible",
    saveUninitialized: false,
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

//* Route pour inscrire un compte client.
app.post("/compte/inscription", async (request, response) => {

  if (!validation.validateAll(request.body)) {
    response.sendStatus(400);
    return;
  } else {
    let courrielExiste = await compte.inscription(
      request.body.prenom,
      request.body.nom,
      request.body.adresse,
      request.body.codePostal,
      request.body.courriel,
      request.body.motDePasse
    );
    if (courrielExiste === 1) {
      response.status(409).send("Un compte existe déjà avec ce courriel.")
    } else if (courrielExiste === 2) {
      response.status(200).send("Bienvenue !");
    }
  }
});


//* Route pour se connecter à un compte.
app.post("/compte/connexion", async (request, response) => {

  let data = await compte.connection(request.body.courriel, request.body.motDePasse);
  if (isEmptyObject(data)) {
    response.sendStatus(401);
  } else {
    if (!request.session.compte) {
      request.session.compte = [];
    }
    request.session.compte = request.body.courriel
    response.status(200).json(data);
  }
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


//=============================================================================
// Fonctions de validation d'objets
//=============================================================================
const isEmptyObject = (obj) => {
  return !Object.keys(obj).length;
}