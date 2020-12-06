(() => {

    $(document).on("click", ".ajoutButton", (e) => {
        let id = e.currentTarget.id;

        alert(id);
    });


    $(document).on('click', '#btnPanier', function () {
        $("#modalPanier").modal();
    });

    // $("#btnPanier").on("click", () => {
    //     $("#modalPanier").modal();
    // });

    //1 Aller chercher le ID ITEM SUR DB



    // const ajouterPanier = (product) => {
    //     const productId = $(product).attr('productId');
    //     const isAlreadyInCart = $.grep(productsInCart, el => {return el.id == productId}).length;

    //     if (isAlreadyInCart) {
    //       $.each(storageData, (i, el) => {
    //         if (productId == el.id) {
    //           el.itemsNumber += 1;
    //         }
    //       })
    //     } else {
    //       const newProduct = {
    //         id: Number(productId),
    //         itemsNumber: 1
    //       }
    //     }
    // }
})();