//Collapse delay fix
// * Fonction qui trouve le collapse cliqué et ajuste le flex-wrap +
// * icone de flèche en conséquence.
$(".targetID").on("click", function (e) {
  e.preventDefault();
  let href = $(this).attr("href");
  let slicedHref = href.slice(1, href.length);

  $(href).on("show.bs.collapse", () => {
    // do something…
    $(href).addClass("d-flex flex-wrap justify-content-around");
    $(`.card-header.${slicedHref}`)
      .find("i")
      .removeClass("fas fa-angle-right rotate-icon");
    $(`.card-header.${slicedHref}`)
      .find("i")
      .addClass("fas fa-angle-down rotate-icon");
  });

  $(href).on("hidden.bs.collapse", () => {
    // do something…
    $(href).removeClass("d-flex flex-wrap justify-content-around");
    $(`.card-header.${slicedHref}`)
      .find("i")
      .removeClass("fas fa-angle-down rotate-icon");
    $(`.card-header.${slicedHref}`)
      .find("i")
      .addClass("fas fa-angle-right rotate-icon");
  });
});
