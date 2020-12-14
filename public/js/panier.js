(() => {

    //Liste des produits sur le serveur.
    let listeProduit = [];
    let produitPanier = [];
    let sessionProduit = [];
    let qtyCheck = 0;

    //*Fonction pour aller chercher les items du menu sur la BDD.
    const getItemsBDD = async () => {
        //Fetch les items sur la BDD
        let responseBDD = await fetch("/item");
        if (responseBDD.ok) {
            listeProduit = await responseBDD.json();
            return true;
        } else {
            return;
        }
    };

    //*Fonction pour reprendre une session d'achat.
    const checkPanierSession = async () => {
        //Fetch les produits en session.
        let responseSession = await fetch("/panier");
        if (responseSession.ok) {


            // Si la session est vide.
            let listeItem = await responseSession.json();
            const isSessionVide = !Object.keys(listeItem).length;
            if (isSessionVide) {
                //Désactivation du button commande.
                $('#commandeButton').prop('disabled', true);
                return;
            }

            // Sinon on reprend les produits en session.
            else {
                sessionProduit = listeItem;

                //On attend les items de la BDD.
                let itemsRdy = await getItemsBDD();
                if (itemsRdy) {
                    updatePanier();
                    construireListeProduit();
                    attacherEvenements();
                    $('#commandeButton').prop('disabled', false);
                }
            }
        }
    };


    //* Modal panier.
    $('#btnPanier').on('click', () => {
        $("#modalPanier").modal();

        //Store lees produits en session à l'ouverture du panier.
        (async () => {
            let response = await fetch("/panier", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(sessionProduit),
            });
        })();

    });

    //* Modal panier > button commande.
    $('#commandeButton').on('click', () => {

        //Petit refresh de sécurité
        updatePrixTotal();

        //Prix total de la commande
        let commandeData = {
            prixTotal: Number($('#total').text().slice(1)),
            produits: sessionProduit
        };

        //Envoyer la commande au serveur.
        const envoyerCommande = async () => {
            let response = await fetch("/commande", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(commandeData)
            });
        };

        envoyerCommande();

        //Vide les produits en session, 
        //ferme le modal vide la liste de produit et update.
        $("#modalPanier").modal("hide");
        sessionProduit = [];
        updatePanier();
        $('#listeProduit').empty();
    });

    //Bouttons ajouter.
    $(document).on("click", ".ajoutButton", (e) => {
        qtyCheck += 1;
        if (qtyCheck > 0) {
            $('#commandeButton').prop('disabled', false);
        }
        ajouterPanier(e.currentTarget);
    });

    //*Fonction qui ajoute l'item au panier dépendant de l'ID du produit.
    const ajouterPanier = (product) => {
        //Prendre le ID du produit.
        const idProduit = $(product).attr('id');

        //Vérifier si le produit est déjà dans le panier.
        if (produitPanier.some(e => e.id_item == idProduit)) {
            //Ajouter 1 à chaque produit qu'on retrouve dans le panier.
            $.each(sessionProduit, (i, element) => {
                if (idProduit == element.id) {
                    element.qty += 1;
                }
            })
        }
        //Sinon on crée un nouvel objet produit. 
        else {
            const newProduct = {
                id: Number(idProduit),
                qty: 1
            }
            //On le pousse dans la session.
            sessionProduit.push(newProduct);
        }

        updatePanier();
        updateListeProduit();
    };

    //*Fonction qui update le panier.
    const updatePanier = () => {
        //On vide le panier.
        produitPanier = [];
        //On reconstruit les données
        construireDataPanier();
        //On update le Nav Pill.
        updateNavPill();
        //On update le prix total.
        updatePrixTotal();
    };

    //On construit les données du panier en comparant le ID du produit en session 
    //avec ceux de la BDD et on push le tout dans un nouvel array.
    const construireDataPanier = () => {
        $.each(sessionProduit, (i, element) => {
            const id = element.id;
            const qty = element.qty;

            $.each(listeProduit, (i, element) => {
                if (id == element.id_item) {
                    element.qty = qty;
                    produitPanier.push(element)
                }
            });
        });
    };

    //On update le nav pill avec la qty totale dans le panier.
    const updateNavPill = () => {
        let qtyProduitPanier = 0;

        $.each(produitPanier, (i, element) => {
            qtyProduitPanier += element.qty;
        });

        $('#qtyTotalNav').html(qtyProduitPanier);
    }



    //On update le sous-total, taxes et le total sur le nav pill ainsi que dans le panier.
    const updatePrixTotal = () => {
        let sousTotal = 0;
        const tauxTaxable = 15;

        $.each(produitPanier, (i, el) => {
            sousTotal += el.qty * el.prix;
        });

        $('#sousTotalNav').html(`$${sousTotal.toFixed(2)}`);

        let taxes = (sousTotal * tauxTaxable) / 100

        let total = (taxes + sousTotal).toFixed(2);

        $('#sousTotal').html(`$${sousTotal.toFixed(2)}`);
        $('#taxes').html(`$${taxes.toFixed(2)}`);
        $('#total').html(`$${total}`);
    }

    //Vidange de la liste de produit présentement afficher et reconstruction.
    const updateListeProduit = () => {
        $('#listeProduit').empty();
        construireListeProduit();
        attacherEvenements();
    };

    //Construction de la liste
    const construireListeProduit = () => {
        $.each(produitPanier, (i, element) => {
            const product = templateProduit(element);
            $('#listeProduit').append(product);
        })
    };

    //Template pour la construction
    const templateProduit = (produit) => {
        return `
        <tr id="${produit.id_item}" class="produit">
        <td class="border-0">
          <div><img class="img-fluid rounded" src="img/food-pictures/${produit.image}" width="80" />
            <div class="ml-3 d-inline-block align-middle">
              <h5 class="mb-0 d-none d-lg-block">${produit.nom}</h5>
              <span class="d-none d-lg-block">Catégorie: ${produit.categorie}</span>
            </div>
          </div>
        </td>
        <td class="border-0 align-middle text-center">
          <span class="prix">$${produit.prix.toFixed(2)}</span>
        </td>
        <td class="border-0 align-middle text-center">
          <span class="qty">${produit.qty}</span>
          <div class="d-inline-block align-middle ml-4">
            <button class="btn augmenter">
                <i class="fa fa-plus mb-3"></i>
            </button>
            <button class="btn diminuer d-block">
                <i class="fa fa-minus"></i>
            </button>
          </div>
        </td>
        <td class="border-0 align-middle text-center">
          <button class="btn supprimer">
            <i class="fa fa-trash fa-lg"></i>
          </button>
        </td>
      </tr>
                    `
    };

    //*Fonction pour attacher les évenements 
    //*aux buttons ajouter, diminuer et supprimer.
    const attacherEvenements = () => {
        $('button.augmenter').on('click', (e) => {
            augmenterQty(e.currentTarget);
        });

        $('button.diminuer').on('click', (e) => {
            diminuerQty(e.currentTarget);
        });

        $('button.supprimer').on('click', (e) => {
            supprimerProduit(e.currentTarget);
        });
    };

    //*Fonction pour augmenter la qty d'un produit dans le panier.
    const augmenterQty = (produit) => {
        //Get le ID du produit.
        const productId = $(produit).parents('.produit').get(0).id;

        //Get le prix du produit en le comparant au ID dans produit panier.
        const price = $.grep(produitPanier, element => {
            return element.id_item == productId
        })[0].prix;

        //Pour chaque produit dans sessionProduit,
        $.each(sessionProduit, (i, element) => {
            //Si le id du produit est = au id dans la session,
            if (element.id == productId) {
                //Augmente la qty à partir du ID en session.
                element.qty += 1;

                //Ajuste le HTML avec la nouvelle qty, prix.
                $(`#${productId}`).find('.qty').html(element.qty);
                $(`#${productId}`).find('.prix').html(`$${(price * element.qty).toFixed(2)}`);
            }
        });


        updatePanier();
    };

    //*Fonction pour diminuer la qty d'un produit dans le panier.
    const diminuerQty = (produit) => {
        //Get le ID du produit.
        const productId = $(produit).parents('.produit').get(0).id;

        //Get le prix du produit en le comparant au ID dans produit panier.
        const price = $.grep(produitPanier, element => {
            return element.id_item == productId
        })[0].prix;

        //Get la qty du produit choisis en comparant le ID du produit
        //aux produits dans le panier.
        let itemsInCart = $.grep(produitPanier, element => {
            return element.id_item == productId
        })[0].qty;

        //Si la qty est plus grande que 1 (sinon on peux pas diminuer)
        if (itemsInCart > 1) {
            //On map sur les elements de sessionProduit,
            sessionProduit.map(element => {
                //Si le id est égal au produit dans la session.
                if (element.id == productId) {
                    //On diminue la qty en session.
                    element.qty -= 1

                    //Ajuste le HTML.
                    $(`#${productId}`).find('.qty').html(element.qty);
                    $(`#${productId}`).find('.prix').html(`$${(price * element.qty).toFixed(2)}`);
                }
            });

            updatePanier();
        };
    }

    //* Fonction qui supprime un produit de la session.
    const supprimerProduit = (produit) => {
        //Get le ID du produit.
        const productId = $(produit).parents('.produit').get(0).id

        //Retourne un array sans le produit supprimé.
        sessionProduit = $.grep(sessionProduit, (element, i) => {
            return element.id != productId
        });

        updatePanier();
        updateListeProduit();
    }

    getItemsBDD();
    checkPanierSession();
})();