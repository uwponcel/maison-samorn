(() => {
  // TODO Switch modal windows connect -> signup
  $("#connectInscription").on("click", () => {
    $("#connectionModal").modal("hide");
    $("#signUpModal").modal();
  });
})();