DROP DATABASE IF EXISTS maison_samorn;

CREATE DATABASE maison_samorn
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
USE maison_samorn;

DROP TABLE IF EXISTS compte;
CREATE TABLE compte (
	id_compte INT AUTO_INCREMENT,
    type_de_compte VARCHAR(11),
    prenom VARCHAR(50) NOT NULL,
    nom VARCHAR(50) NOT NULL,
    adresse VARCHAR(100) NOT NULL,
    code_postal CHAR(7) NOT NULL,
    ville VARCHAR(50) NOT NULL,
    courriel VARCHAR(50) NOT NULL,
    mot_de_passe VARCHAR(50) NOT NULL,
    CONSTRAINT PRIMARY KEY(id_compte)
);

DROP TABLE IF EXISTS commande;
CREATE TABLE commande (
	id_commande INT AUTO_INCREMENT,
    id_compte INT,
    etat VARCHAR(13),
    date DATETIME,
    prix_total FLOAT,
    envoyer BOOL DEFAULT FALSE,
    CONSTRAINT prix_total CHECK(
        prix_total >= 0
    ),
    CONSTRAINT PRIMARY KEY(id_commande)
);

DROP TABLE IF EXISTS item;
CREATE TABLE item (
	id_item INT AUTO_INCREMENT,
    nom VARCHAR(50),
    categorie VARCHAR(30),
    image TINYTEXT,
    prix FLOAT,
    description TINYTEXT,
    CONSTRAINT PRIMARY KEY(id_item)
);

DROP TABLE IF EXISTS commande_item;
CREATE TABLE commande_item (
	id_commande INT,
    id_item INT,
	quantite INT NOT NULL DEFAULT 1,
    prix_total_produit FLOAT,
	CONSTRAINT prix_total_produit CHECK(
        prix_total_produit >= 0
    ),
    CONSTRAINT PRIMARY KEY(id_commande,id_item)
);

ALTER TABLE commande
ADD CONSTRAINT fk_commande_compte
FOREIGN KEY(id_compte)
REFERENCES compte(id_compte)
ON DELETE RESTRICT
ON UPDATE CASCADE;

ALTER TABLE commande_item
ADD CONSTRAINT fk_commande_item_commande
FOREIGN KEY(id_commande)
REFERENCES commande(id_commande)
ON DELETE RESTRICT
ON UPDATE CASCADE;

ALTER TABLE commande_item
ADD CONSTRAINT fk_commande_item_item
FOREIGN KEY(id_item)
REFERENCES item(id_item)
ON DELETE RESTRICT
ON UPDATE CASCADE;

CREATE INDEX idx_nom_item ON item(nom);