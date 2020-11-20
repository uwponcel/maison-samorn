//Open the modals on nav buttons click.
$("#navSignUpButton").on("click", () => {
  $("#signUpModal").modal();
});
$("#navConnectButton").on("click", () => {
  $("#connectionModal").modal();
});

//Switch modal windows connect -> signup
$("#connectInscription").on("click", () => {
  $("#connectionModal").modal("hide");
  $("#signUpModal").modal();
});

//Collapse delay fix //TODO Do for all the collapses
$("#collapseAppetizer").on("show.bs.collapse", function () {
  // do something…
  $("#collapseAppetizer").addClass("d-flex flex-wrap justify-content-around");
  $(".card-header").find("i").removeClass("fas fa-angle-right rotate-icon");
  $(".card-header").find("i").addClass("fas fa-angle-down rotate-icon");
});

$("#collapseAppetizer").on("hidden.bs.collapse", function () {
  // do something…
  $("#collapseAppetizer").removeClass(
    "d-flex flex-wrap justify-content-around"
  );
  $(".card-header").find("i").removeClass("fas fa-angle-down rotate-icon");
  $(".card-header").find("i").addClass("fas fa-angle-right rotate-icon");
});
