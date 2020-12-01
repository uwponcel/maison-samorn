(() => {
    // TODO SESSIONS + CONNEXION VALIDATION
    //==================================================================================================
    //* Nav Link + modal
    //==================================================================================================
    let connexionLien = document.getElementById("connexionLien");
    let connectionModal = document.getElementById("connectionModal")
    $(connexionLien).on("click", () => {
        $(connectionModal).modal();
    });
    let courriel = document.getElementById("connexionCourriel");
    let motDePasse = document.getElementById("connexionMotDePasse");
    let connexionButton = document.getElementById("connexionButton");
    let form = document.getElementById("connexionForm");



    const validateCourriel = () => {
        disposeToolTip(courriel);
        if (courriel.validity.valid) {
            disposeToolTip(courriel);
        } else {
            if (courriel.validity.valueMissing) {
                toolTipRequired(courriel, "top");
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
            }
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



    $(courriel).on("input blur", () => {
        validateCourriel();
    });
    $(motDePasse).on("input blur", () => {
        validateMotDePasse();
    });



    $(connexionButton).on("click", (event) => {
        event.preventDefault();
        console.log("test");

        validateCourriel();
        validateMotDePasse();

        connecterCompte();
    });

    const connecterCompte = async () => {
        if (form.checkValidity()) {
            let formData = {
                courriel: $(courriel).val(),
                motDePasse: $(motDePasse).val()
            };
            let response = await fetch("/compte/connexion", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData),
            });
            if (response.status === 401) {
                tooTipCompteInvalide("Woops.. Courriel ou mot de passe invalide.")
            } else if (response.status === 200) {
                //Vidange des champs
                $(courriel).val("");
                $(motDePasse).val("");

                //Destruction du modal
                $(connectionModal).modal("hide");

                //Changer le nav bar avec le prénom du user.
                let data = await response.json();
                let prenom = data[0]['prenom'];

                $(connexionLien).text(`${prenom}`);
                $("#barreObliqueContainer").addClass(`text-white`);
                $("#barreObliqueContainer").append(`<a class="nav-link text-white" href="#">
                <i class="fas fa-sign-out-alt"></i>
              </a>`);
                $("#barreOblique").hide();


                renameElement($(connexionLien), 'span');
                // $(connexionLien).replaceWith($('<p class="navbar-text">' + this.innerHTML + '</p>'));

                // $("#connexionLien").addClass("navbar-text").removeClass("nav-link").attr;
                $("#inscriptionLienContainer").hide();
                $("#inscriptionLienContainer").hide();


                //$("#barreOblique").show();
            }
        }
    }

    // //* Si le compte (courriel, mot de passe) existe pas afficher un ToolTip avec une erreure.
    const tooTipCompteInvalide = (label) => {
        $(courriel).tooltip({
            title: `<strong class='text-danger'>${label}</strong>`,
            html: true,
            placement: "top",
            trigger: "manual",
        });
        $(courriel).tooltip("show");
        //Pause then hide.
        setTimeout(() => {
            $(courriel).tooltip("dispose");
            $(courriel).val('');
        }, 2000);
    }

    const renameElement = ($element, newElement) => {

        $element.wrap("<" + newElement + ">");
        $newElement = $element.parent();

        //Copying Attributes
        $.each($element.prop('attributes'), function () {
            $newElement.attr(this.name, this.value);
        });

        $element.contents().unwrap();

        return $newElement;
    }

})();