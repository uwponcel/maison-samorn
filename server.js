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
const commande = require("./Database/commande");
const validation = require("./inscription-validation");
const {
  request,
  response
} = require("express");




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

app.get("/panier", async (request, response) => {
  if (request.session.panier === undefined) {
    response.sendStatus(401);
  } else {
    let data = request.session.panier
    console.log(data);
    response.status(200).json(data);
  }
});

app.post("/panier", async (request, response) => {
  request.session.panier = request.body;
  response.sendStatus(200);
});


app.get("/commande", async (request, response) => {
  if (request.session.type_de_compte === "client") {

    let data = await commande.getCommandesClient(
      request.session.id_compte
    );
    response.status(200).json(data);

  } else if (request.session.type_de_compte === "travailleur") {

    let data = await commande.getCommandesTravailleur();

    console.log("compte: travailleur");

    response.status(201).json(data);
  }
  //Aucun des deux compte : unauthorized
  else {
    response.sendStatus(401);
  }
});

app.post("/commande", async (request, response) => {

  //Date d'aujourd'hui
  let date_ob = new Date();
  const dateCourante = date_ob.getFullYear() + "-" + ("0" + (date_ob.getMonth() + 1)).slice(-2) + "-" + ("0" + date_ob.getDate()).slice(-2);

  //Envoyer la commande sur la BDD
  let responseCommande = await commande.commande(
    request.session.id_compte,
    dateCourante,
    request.body.prixTotal,
  )
  console.log(responseCommande);

  //Get le ID de la commande courrante.
  let data = await commande.getCommandeID(
    request.session.id_compte
  );
  let idCommande = data[0]["MAX(c.id_commande)"];
  console.log(idCommande);

  //Join la commande et les items à commande_item sur la BDD
  let responseJoinCommandeItem = await commande.joinCommandeItem(
    idCommande,
    request.body.produits
  )
  console.log(responseJoinCommandeItem);

  response.sendStatus(200);
});

app.post("/commande/etat", async (request, response) => {

  let data = await commande.postCommandeEtat(request.body.id, request.body.etat);

  request.body
  console.log(data);

  response.sendStatus(200);

  //! Broadcast de l'événement
  response.pushJson(request.body, "change");
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
    //Si la session existe pas on la crée.
    // if (!request.session.courriel) {
    //   request.session = [];
    // }

    // Store le id du compte, le courriel et le prenom en session.
    let id_compte = data[0]["id_compte"];
    let type_de_compte = data[0]["type_de_compte"];
    let courriel = data[0]["courriel"]
    let prenom = data[0]["prenom"];
    request.session.id_compte = id_compte;
    request.session.type_de_compte = type_de_compte;
    request.session.courriel = courriel;
    request.session.prenom = prenom;

    //Envoie les données de la BDD (sécurité).
    response.status(200).json(data);
  }
});

//* Route pour la vérification d'une connexion.
app.get("/compte/connexion", async (request, response) => {
  if (!request.session.courriel) {
    response.sendStatus(401);
  } else {
    let compte = {
      courriel: request.session.courriel,
      prenom: request.session.prenom
    }
    response.status(200).send(compte);
  }
});


//* Route pour déconnecter un user.
app.delete("/compte/connexion", async (request, response) => {
  if (!request.session.courriel) {
    response.sendStatus(404);
  } else {
    delete request.session.id_compte;
    delete request.session.type_de_compte;
    delete request.session.courriel;
    delete request.session.prenom;
    delete request.session.panier;
    console.log(request.session.panier);
    response.sendStatus(200);
  }
});


//* Route pour se connecter au serveur en temps réel
app.get("/notification", (request, response) => {
  response.initStream();
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
// Fonction de validation d'objets
//=============================================================================
const isEmptyObject = (obj) => {
  return !Object.keys(obj).length;
};