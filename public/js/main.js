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
