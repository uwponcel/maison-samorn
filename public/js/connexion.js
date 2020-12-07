(() => {
    // TODO SESSIONS + CONNEXION VALIDATION
    //==================================================================================================
    //* Modal
    //==================================================================================================
    //Click listener modal.
    const clickListenerModal = () => {
        $("#connexionLien").on("click", () => {
            $("#connectionModal").modal();
        });
    }
    //==================================================================================================
    //* Form + fields
    //==================================================================================================
    let courriel = document.getElementById("connexionCourriel");
    let motDePasse = document.getElementById("connexionMotDePasse");
    let connexionButton = document.getElementById("connexionButton");
    let form = document.getElementById("connexionForm");

    //==================================================================================================
    //* Form + fields + simple required validation
    //==================================================================================================
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

    //==================================================================================================
    //* Tooltip
    //==================================================================================================
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

    //==================================================================================================
    //* Connection au compte + nav links change.
    //==================================================================================================
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
                $("#connectionModal").modal("hide");

                //Changer le nav bar avec le prénom du user.
                let data = await response.json();
                let prenom = data[0]['prenom'];

                //Connecter le user sur la navBar
                navBarConnecter(prenom);

                $('.ajoutButton').show();
                $('#panier').show();
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

    //Change les liens du nav bar. Prend en paramètre le prénom du user.
    const navBarConnecter = (prenom) => {
        renameElement($("#connexionLien"), 'span');
        $("#connexionLien").text(`${prenom}`);

        $("#barreObliqueContainer").addClass(`text-white`);
        $("#barreObliqueContainer").append(`<a class="nav-link text-white" href="#" id="deconnexionLien">
        <i class="fas fa-sign-out-alt"></i>
      </a>`);
        $("#barreOblique").hide();
        $("#inscriptionLienContainer").hide();


        //Ajouter un click listener sur le lien de déconnexion.
        $("#deconnexionLien").on("click", (event) => {
            event.preventDefault();
            navBarDeconnecter();
            $('.ajoutButton').hide();
            $('#panier').hide();
        });
    }

    //Déconnect l'utilisateur et change les liens sur la navbar.
    const navBarDeconnecter = () => {
        renameElement($("#connexionLien"), 'a');
        $("#connexionLien").text("Se connecter");


        $("barreObliqueContainer").removeClass("text-white");
        $("#deconnexionLien").remove();
        $("#barreOblique").show();

        $("#inscriptionLienContainer").show();

        //Rajouter le click listener pour le modal.
        clickListenerModal();

        //Déconnecter l'utilisateur de la session.
        disconnectUser();
    }

    const disconnectUser = async () => {
        let response = await fetch("/compte/connexion", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
        });
        if (response.status === 200) {
            console.log("Déconnecter");
        }
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

    const connexionCheck = async () => {
        let response = await fetch("/compte/connexion", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        });
        if (response.status === 401) {
            $('#panier').hide();
            return;
        } else if (response.status === 200) {
            //Si la session existe on reprend les infos et on les affiche.
            let data = await response.json();
            let prenom = data.prenom;
            navBarConnecter(prenom);

            //Afficher les bouttons
            $('.ajoutButton').show();
            $('#panier').show();
        }
    }

    clickListenerModal();
    connexionCheck();

})();