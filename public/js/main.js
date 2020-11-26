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

$("#registerButton").on("click", () => {
  let formData = {
    prenom: $("#signUpFirstName").val(),
    nom: $("#signUpLastName").val(),
    adresse: $("#signUpAdress").val(),
    codePostal: $("#signUpCodePostal").val(),
    ville: $("#signUpCourriel").val(),
    email: $("#signUpMotDePasse").val(),
    motDePasse: $("#signUpAdress").val(),
  };
  fetch("/compte", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
});

$("#burgerMenu").on("show.bs.collapse", () => {
  $("#navBarContainer").addClass("flex-row float-right flex-wrap");
  $("#navBarContainer li").each(function (i) {
    $(this).addClass("ml-3");
  });
});

$("#burgerMenu").on("hidden.bs.collapse", () => {
  $("#navBarContainer").removeClass("flex-row float-right flex-wrap");
  $("#navBarContainer li").each(function (i) {
    $(this).removeClass("ml-3");
  });
});
