//Collapse delay fix
(() => {
  let listeItem = [];

  const getItemServeur = async () => {
    let response = await fetch("/item");
    console.log(response);
    if (response.ok) {
      listeItem = await response.json();
      console.log(listeItem);
      for (let item of listeItem) {
        ajouterItemCollapse(
          item.nom,
          item.categorie,
          item.image,
          item.prix,
          item.description
        );
      }
    }
  };

  const ajouterItemCollapse = (nom, categorie, image, prix, description) => {
    let htmlElement = selectCategorie(nom, image, prix, description);
    switch (categorie) {
      case "Soupes":
        $("#collapseSoupes").append(htmlElement);
        break;
      case "Entrées":
        $("#collapseEntrees").append(htmlElement);
        break;
      case "Salades":
        $("#collapseSalades").append(htmlElement);
        break;
      case "Fruits De Mer":
        $("#collapseFruitsDeMer").append(htmlElement);
        break;

      case "Cari":
        $("#collapseCaris").append(htmlElement);
        break;

      case "Sautés":
        $("#collapseSautes").append(htmlElement);
        break;

      case "Riz Frit":
        $("#collapseRizFrit").append(htmlElement);
        break;

      case "Nouilles":
        $("#collapseNouilles").append(htmlElement);
        break;

      case "Végétarien":
        $("#collapseVegetarien").append(htmlElement);
        break;

      case "Desserts":
        $("#collapseDesserts").append(htmlElement);
        break;

      default:
        console.log(
          "Error : Check collapse matching and categorie word in Database"
        );
      // code block
    }

    console.log(categorie);
    // switch
  };

  const selectCategorie = (nom, image, prix, description) => {
    let html = ` 
   <div class="card element flex-shrink" id="foodCard">
      <img src="img/food-pictures/${image}" class="card-img-top" alt="..." />
      <div class="card-body d-flex flex-column">
        <h5 class="card-title mt-2 text-center">${nom} </h5>
        <h3 class="card-prix mr-auto ml-auto">${prix}$</h3>
        <p class="card-text">
          ${description}
        </p>
        <div class="mt-auto ml-auto mr-3 mb-1">
          <button class="ajoutButton">
            <i class="fa fa-plus" aria-hidden="true"></i>
            <span>Ajouter</span>
          </button>
        </div>
      </div>
    </div>`;

    //   <div class="d-flex align-items-end flex-column" style="height: 200px;">
    //   <div class="p-2">Flex item</div>
    //   <div class="p-2">Flex item</div>
    //   <div class="mt-auto p-2">Flex item</div>
    // </div>
    return html;
  };

  // * Fonction qui trouve le collapse cliqué et ajuste le flex-wrap +
  // * icone de flèche en conséquence.
  $(".targetID").on("click", function (e) {
    e.preventDefault();
    let href = $(this).attr("href");
    let slicedHref = href.slice(1, href.length);

    $(href).on("show.bs.collapse", () => {
      // do something…
      $(href).addClass("d-flex flex-wrap justify-content-start");
      $(`.card-header.${slicedHref}`)
        .find("i")
        .removeClass("fas fa-angle-right rotate-icon");
      $(`.card-header.${slicedHref}`)
        .find("i")
        .addClass("fas fa-angle-down rotate-icon");
    });

    $(href).on("hidden.bs.collapse", () => {
      // do something…
      $(href).removeClass("d-flex flex-wrap justify-content-start");
      $(`.card-header.${slicedHref}`)
        .find("i")
        .removeClass("fas fa-angle-down rotate-icon");
      $(`.card-header.${slicedHref}`)
        .find("i")
        .addClass("fas fa-angle-right rotate-icon");
    });
  });

  // ? Get les items du menu sur le serveur -> BDD
  getItemServeur();

  // some code…
})();
