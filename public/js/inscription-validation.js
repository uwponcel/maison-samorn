(() => {
  //* Champs du formulaire
  let prenom = document.getElementById("inscriptionPrenom");
  let nom = document.getElementById("inscriptionNom");
  let adresse = document.getElementById("inscriptionAdresse");
  let codePostal = document.getElementById("inscriptionCodePostal");
  let courriel = document.getElementById("inscriptionCourriel");
  let motDePasse = document.getElementById("inscriptionMotDePasse");
  let confirmationMotDePasse = document.getElementById(
    "inscriptionMotDePasseConfirm"
  );
  let inscriptionButton = document.getElementById("inscriptionButton");

  //* Formulaire
  let form = document.getElementById("inscriptionForm");

  const validatePrenom = () => {
    disposeToolTip(prenom);
    if (prenom.validity.valid) {
      disposeToolTip(prenom);
    } else {
      if (prenom.validity.valueMissing) {
        toolTipRequired(prenom, "top");
      } else if (prenom.validity.tooShort) {
        toolTipMinLenght(prenom, "top", 2, "prénom");
      } else if (prenom.validity.tooLong) {
        toolTipMaxLenght(prenom, "top", 50, "prénom");
      }
    }
  };

  const validateNom = () => {
    disposeToolTip(nom);
    if (nom.validity.valid) {
      disposeToolTip(nom);
    } else {
      if (nom.validity.valueMissing) {
        toolTipRequired(nom, "top");
      } else if (nom.validity.tooShort) {
        toolTipMinLenght(nom, "top", 2, "nom");
      } else if (nom.validity.tooLong) {
        toolTipMaxLenght(nom, "top", 50, "nom");
      }
    }
  };

  const validateAdresse = () => {
    disposeToolTip(adresse);
    if (adresse.validity.valid) {
      disposeToolTip(adresse);
    } else {
      if (adresse.validity.valueMissing) {
        toolTipRequired(adresse, "top");
      } else if (adresse.validity.tooShort) {
        toolTipMinLenght(adresse, "top", 5, "adresse");
      } else if (adresse.validity.tooLong) {
        toolTipMaxLenght(adresse, "top", 100, "adresse");
      }
    }
  };

  const validateCodePostal = () => {
    disposeToolTip(codePostal);
    if (codePostal.validity.valid) {
      disposeToolTip(codePostal);
    } else {
      if (codePostal.validity.valueMissing) {
        toolTipRequired(codePostal, "top");
      } else if (codePostal.validity.tooShort) {
        toolTipMinLenght(codePostal, "top", 7, "code postal");
      } else if (codePostal.validity.tooLong) {
        toolTipMaxLenght(codePostal, "top", 7, "code postal");
      } else if (codePostal.validity.patternMismatch) {
        toolTipPatternMismatch(codePostal, "top", "A1A 1A1", "code postal");
      }
    }
  };

  const validateCourriel = () => {
    disposeToolTip(courriel);
    if (courriel.validity.valid) {
      disposeToolTip(courriel);
    } else {
      if (courriel.validity.valueMissing) {
        toolTipRequired(courriel, "top");
      } else if (courriel.validity.tooShort) {
        toolTipMinLenght(courriel, "top", 5, "courriel");
      } else if (courriel.validity.tooLong) {
        toolTipMaxLenght(courriel, "top", 50, "courriel");
      } else if (courriel.validity.patternMismatch) {
        toolTipPatternMismatch(courriel, "top", "abc@abc.abc", "courriel");
      }
    }
  };

  const validateMotDePasse = () => {
    disposeToolTip(motDePasse);
    if (motDePasse.validity.valid) {
      disposeToolTip(motDePasse);
    } else {
      if (motDePasse.validity.valueMissing) {
        toolTipRequired(motDePasse, "top");
      } else if (motDePasse.validity.tooShort) {
        toolTipMinLenght(motDePasse, "top", 6, "mot de passe");
      } else if (motDePasse.validity.tooLong) {
        toolTipMaxLenght(motDePasse, "top", 50, "mot de passe");
      }
    }
  };

  const validateConfirm = () => {
    if (motDePasse.value !== confirmationMotDePasse.value) {
      confirmationMotDePasse.setCustomValidity("not-valid-confirm");
    } else {
      confirmationMotDePasse.setCustomValidity("");
    }
  };

  const validateMotDePasseConfirm = () => {
    disposeToolTip(confirmationMotDePasse);
    validateConfirm();
    if (confirmationMotDePasse.validity.valid) {
      disposeToolTip(confirmationMotDePasse);
    } else {
      toolTipPasswordConfirm(confirmationMotDePasse, "top");
    }
  };

  const disposeToolTip = (id) => {
    $(id).tooltip("dispose");
  };

  const toolTipRequired = (id, placement) => {
    $(id).tooltip({
      title: "<strong class='text-danger'>Ceci est un champ requis.</strong>",
      html: true,
      placement: placement,
      trigger: "manual",
    });
    $(id).tooltip("show");
  };

  const toolTipMinLenght = (id, placement, min, label) => {
    $(id).tooltip({
      title: `<strong class='text-danger'>Votre ${label} doit avoir un minimum de ${min} lettres.</strong>`,
      html: true,
      placement: placement,
      trigger: "manual",
    });
    $(id).tooltip("show");
  };

  const toolTipMaxLenght = (id, placement, max, label) => {
    $(id).tooltip({
      title: `<strong class='text-danger'>Votre ${label} doit avoir un maximum de ${max} lettres.</strong>`,
      html: true,
      placement: placement,
      trigger: "manual",
    });
    $(id).tooltip("show");
  };

  const toolTipPatternMismatch = (id, placement, pattern, label) => {
    $(id).tooltip({
      title: `<strong class='text-danger'>Votre ${label} doit avoir le format ${pattern}.</strong>`,
      html: true,
      placement: placement,
      trigger: "manual",
    });
    $(id).tooltip("show");
  };

  const toolTipPasswordConfirm = (id, placement) => {
    $(id).tooltip({
      title: `<strong class='text-danger'>Votre mot de passe doit être identique.</strong>`,
      html: true,
      placement: placement,
      trigger: "manual",
    });
    $(id).tooltip("show");
  };

  /**
   ** Ajouter les fonctions de validation lorsque l'utilisateur change la valeur ou dé-focus l'input
   */
  //* Code IMBD
  $(prenom).on("input blur", () => {
    validatePrenom();
  });
  $(nom).on("input blur", () => {
    validateNom();
  });
  $(adresse).on("input blur", () => {
    validateAdresse();
  });
  $(codePostal).on("input blur", () => {
    validateCodePostal();
  });
  $(courriel).on("input blur", () => {
    validateCourriel();
  });
  $(motDePasse).on("input blur", () => {
    validateMotDePasse();
  });
  $(confirmationMotDePasse).on("input blur", () => {
    validateMotDePasseConfirm();
  });

  /**
   ** Event listeners pour les buttons inscriptions.
   */
  $("#navSignUpButton").on("click", () => {
    $("#signUpModal").modal();
  });

  $(inscriptionButton).on("click", (event) => {
    event.preventDefault();

    validatePrenom();
    validateNom();
    validateAdresse();
    validateCodePostal();
    validateCourriel();
    validateMotDePasse();
    validateMotDePasseConfirm();

    ajouterCompte();
  });

  const ajouterCompte = async () => {
    if (form.checkValidity()) {
      let formData = {
        prenom: $("#inscriptionPrenom").val(),
        nom: $("#inscriptionNom").val(),
        adresse: $("#inscriptionAdresse").val(),
        codePostal: $("#inscriptionCodePostal").val(),
        courriel: $("#inscriptionCourriel").val(),
        motDePasse: $("#inscriptionMotDePasse").val(),
      };
      let response = await fetch("/compte", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      // let data = await response.json();

      // console.log(data);
    }
  };
})();
