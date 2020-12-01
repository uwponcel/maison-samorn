// getItemServeur();
// connexionCheck();
// clickListenerModal();
// import {
//   getItemServeur,
//   collapseArrow
// } from "./menu.js";

// import {
//   connexionCheck
// } from "./connexion.js"

(() => {

  //Initialisation des items sur le menu.
  // getItemServeur();
  // collapseArrow();



  // //Check 
  // connexionCheck();




  // TODO Switch modal windows connect -> signup
  $("#connectInscription").on("click", () => {
    $("#connectionModal").modal("hide");
    $("#signUpModal").modal();
  });
})();