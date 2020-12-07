(() => {

    $('#commandesLien').on('click', () => {


        (async () => {
            let response = await fetch("/commande");
            if (response.status === 200) {
                console.log("All good");
                $("#modalCommandes").modal();
            }
        })();





    });


    //Button compte on click

    //si le compte est client : afficher les commandes passé pas cet utilisateur avec l'état en cours

    //Fetch sur la BDD des commandes passé avec le ce idcompte.

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