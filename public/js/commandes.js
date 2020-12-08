(() => {
    $('#commandesLien').on('click', () => {

        (async () => {
            let response = await fetch("/commande");
            //client
            if (response.status === 200) {

                const listeCommandes = await response.json();
                console.log(listeCommandes);

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

                console.log(listeCommandesJoin);

                $('#commandes').empty();

                for (let commande of listeCommandesJoin) {
                    const commandeUI = buildHtml(commande);
                    $('#commandes').append(commandeUI);
                }

                $("#modalCommandes").modal();

            }
            //travailleur 
            else if (response.status === 201) {

            }
            //non connecté
            else {

            }
        })();

        const buildHtml = (commande) => {
            const date = commande.date.slice(0, 10);
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
        }


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