const pool = require("./pool");

exports.commande = async (
    idCompte,
    date,
    prixTotal,
) => {
    let connection = await pool;
    connection.query(
        `INSERT INTO commande(
            id_compte,
            date,
            prix_total
        )
        VALUES(?,?,?)`,
        [idCompte, date, prixTotal]
    );

    return "Commande ajouté.";
};

exports.getCommandeID = async (
    idCompte
) => {
    let connection = await pool;
    let results = await connection.query(
        `SELECT MAX(c.id_commande)
        FROM commande c
        WHERE c.id_compte = ?`,
        [idCompte]
    );

    return results;
};

exports.joinCommandeItem = async (
    idCommande,
    produits
) => {
    (async () => {
        let connection = await pool;
        for (let item of produits) {
            const id = item.id;
            const qty = item.qty;
            connection.query(
                `INSERT INTO commande_item(
                    id_commande,
                    id_item,
                    quantite
                )
                VALUES(?,?,?)`,
                [idCommande, id, qty]
            );
        }
    })();

    return "Commande jointe.";
};