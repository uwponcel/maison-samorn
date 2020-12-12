(() => {
    $('#commandesLien').on('click', () => {

        (async () => {
            let response = await fetch("/commande");
            //client
            if (response.status === 200) {

                //Fetch les commandes d'un user sur la BDD
                const listeCommandes = await response.json();

                //Joindre la liste avec les ids de commandes identique.
                const listeCommandesJoin = fetchUserOrders(listeCommandes);

                console.log("Liste commandes join : ")
                console.log(listeCommandesJoin);

                //Construire le modal avec les commandes.
                $('#commandesContainer').empty();

                for (let commande of listeCommandesJoin) {
                    const commandeUI = buildHtmlUser(commande);
                    $('#commandesContainer').append(commandeUI);
                }

                //Afficher le modal.
                $("#modalCommandes").modal();

            }
            //travailleur 
            else if (response.status === 201) {

                //Fetch les commandes des users sur la BDD
                const listeCommandes = await response.json();

                console.log(listeCommandes);

                //Construire le modal avec les commandes.
                $('#commandesContainer').empty();

                for (let commande of listeCommandes) {
                    const commandeUI = buildHtmlWorker(commande);
                    $('#commandesContainer').append(commandeUI);

                    //Disable l'état en cours.
                    switch (commande.etat) {
                        case "en traitement":
                            $('#commandesContainer .dropdown-menu').find('.traitement').addClass('disabled');
                            break;
                        case "en cuisine":
                            $('#commandesContainer .dropdown-menu').find('.cusine').addClass('disabled');
                            break;
                        case "en livraison":
                            $('#commandesContainer .dropdown-menu').find('.cusine').addClass('disabled');
                            break;
                        case "terminée":
                            $('#commandesContainer .dropdown-menu').find('.terminee').addClass('disabled');
                            break;
                    }
                }

                // bindEvent();

                //Afficher le modal.
                $("#modalCommandes").modal();

                bindEvent();


            }
            //non connecté
            else {

            }
        })();

        const fetchUserOrders = (listeCommandes) => {
            //Fonction qui réduit les résultats de la requêtes en une seule commande.
            const listeCommandesJoin = listeCommandes.reduce((res, current) => {
                // see if id is already in the output
                const result = res.find(e => e.id_commande === current.id_commande);
                if (result) {
                    // if the id is there update the plats with the new info
                    result.plats = [...result.plats, {
                        nom: current.nom,
                        quantite: current.quantite
                    }]
                    return res
                } else {
                    // if the id isn't there, add a new object.
                    return [...res, {
                        id_commande: current.id_commande,
                        date: current.date,
                        etat: current.etat,
                        plats: [{
                            nom: current.nom,
                            quantite: current.quantite
                        }],
                        prix_total: current.prix_total
                    }]
                }
            }, [])


            return listeCommandesJoin;
        };

        const dateBuilder = (commande) => {
            const date = commande.date.slice(0, 10);
            return date;
        }

        const buildHtmlUser = (commande) => {
            const date = dateBuilder(commande);
            let platHtml = ``;
            for (let plats of commande.plats) {
                platHtml += `<li class="list-inline-item"><span>${plats.nom} : ${plats.quantite} <span class="divider">|</span></span></li>`
            }
            return ` <div class="card order-list shadow-sm">
            <div class="p-4">
              <span class="float-right badge badge-info">${(commande.etat).toUpperCase()}</span>
              <h6 class="mb-2">
                <p>Commande #${commande.id_commande}</p>
              </h6>
              <ul class="list-inline">
                ${platHtml}
              </ul>
              <hr>
              <span class="float-right">${date}</span>
              <h6 class="mb-0 pt-2 orange">
                <span class="total-price">Prix total:</span> $${commande.prix_total}
              </h6>            
            </div>
          </div>`
        };

        const buildHtmlWorker = (commande) => {
            const date = dateBuilder(commande);
            return ` 
            <div class="card order-list shadow-sm">
                <div class="p-4 find-id">
                    
                    <span class="float-right badge badge-info">
                        <span class="etat">${(commande.etat).toUpperCase()} </span>
                        <div class="dropdown mt-2">
                            <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown">
                                Changer état
                            </button>
                            <div class="dropdown-menu">
                                <button class="dropdown-item traitement" type="button">En traitement</button>
                                <button class="dropdown-item cusine" type="button">En cuisine</button>
                                <button class="dropdown-item livraison" type="button">En livraison</button>
                                <button class="dropdown-item terminee" type="button">Terminée</button>
                            </div>
                        </div>
                    </span>
                    <h6 class="mb-2">
                        <p class="id">Commande #${commande.id_commande}</p>
                    </h6>
                    
                    <ul class="list-group">
                        <li class="list-group-item">${commande.prenom} ${commande.nom}</li>
                        <li class="list-group-item">${commande.adresse} , ${commande.code_postal}</li>
                    </ul>
                    <hr>
                    <span class="float-right">${date}</span>
                    <h6 class="mb-0 pt-2 orange">
                        <span class="total-price">Prix total:</span> $${commande.prix_total}
                    </h6>            
                </div>
            </div>`

        };

        const bindEvent = () => {
            $('button.dropdown-item').on('click', (e) => {
                //Get the order ID.
                let id = $(e.currentTarget).closest('.find-id').find('.id').text().match(/\d+/)[0];
                //Get the selected état text to lower case.
                let etat = $(e.currentTarget).text().toLowerCase();

                //Send the new état to the server.
                sendEvent(id, etat);


                //Sets the selected état text and insert in the état label.
                $(e.currentTarget).closest('.badge').find('.etat').html($(e.currentTarget).text().toUpperCase());

                //Disable the selected état and enable the others
                $(e.currentTarget).siblings().removeClass('disabled');
                $(e.currentTarget).addClass('disabled');
            });
        };

        const sendEvent = (id, etat) => {
            let etatData = {
                id: Number(id),
                etat: etat
            };
            //Envoyer le nouvel état au serveur.
            (async () => {
                let response = await fetch("/commande/etat", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(etatData)
                });
            })();
        }

        /**
         ** Connexion au serveur pour avoir les notifications en temps réel.
         */
        const connecterTempsReel = async () => {
            let source = new EventSource("/notification");

            source.addEventListener("change", (event) => {
                let data = JSON.parse(event.data);
                let id = data.id;
                let etat = data.etat;

                if ($('.order-list')) {
                    $('.order-list').find('badge').html();
                }


                console.log(id);
                console.log(etat);
            });
        };

        connecterTempsReel();
    });


    //Button compte on click

    //si le compte est client : afficher les commandes passé pas cet utilisateur avec l'état en cours

    //Fetch sur la BDD des commandes passé avec ce idcompte.

    //construire un tableau

    //contruire un template de visualisation

    //Afficher dans le html 



    //si le compte est travailleur : afficher toutes les commandes passé avec l'état en cours
    //Fetch sur la BDD de toutes les commandes.  

    //construire un tableau

    //contruire un template de visualisation

    //Afficher dans le html 

    //Bouttons état on click 
    //Post sur la BDD de la nouvel état à partir du id de la commande

    //Afficher en temps réel la nouvel état pour le client

    //Si l'état est changé à terminée, disable tout les liens d'états (fin de la commannde)


})();