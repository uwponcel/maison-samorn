DROP DATABASE IF EXISTS maison_samorn;

CREATE DATABASE maison_samorn
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
USE maison_samorn;

DROP TABLE IF EXISTS compte;
CREATE TABLE compte (
	id_compte INT AUTO_INCREMENT,
    type_de_compte VARCHAR(11) DEFAULT 'client',
    prenom VARCHAR(50) NOT NULL,
    nom VARCHAR(50) NOT NULL,
    adresse VARCHAR(100) NOT NULL,
    code_postal CHAR(7) NOT NULL,
    courriel VARCHAR(50) NOT NULL,
    mot_de_passe VARCHAR(50) NOT NULL,
    CONSTRAINT PRIMARY KEY(id_compte),
    CONSTRAINT UNIQUE (courriel)
);

DROP TABLE IF EXISTS commande;
CREATE TABLE commande (
	id_commande INT AUTO_INCREMENT,
    id_compte INT,
    etat VARCHAR(13) DEFAULT 'en traitement',
    date DATE,
    prix_total FLOAT,
    -- envoyer BOOL DEFAULT FALSE,
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


-- ---------------------- COMPTE TRAVAILLEUR TEST ----------------------------------------------------------------
INSERT INTO compte(type_de_compte, prenom, nom, adresse, code_postal, courriel, mot_de_passe)
VALUES('travailleur', 'Gabriel', 'Bellemare','95 rue Le Loutre', 'J8V 2A8','gabrielbellemare@gmail.com', '123456');

INSERT INTO compte(type_de_compte, prenom, nom, adresse, code_postal, courriel, mot_de_passe)
VALUES('client', 'William', 'Poncelet','446 rue de la rue', 'J8V 2A8','uwponcel@gmail.com', '123456');

-- ---------------------- SOUPE ----------------------------------------------------------------------
INSERT INTO item(nom, categorie, image, prix, description)
VALUES('Tom Yum Goong', 'Soupes', 'tom-yum-goong.jpg','7.0','Bouillon ?? la citronnelle et aux crevettes');

INSERT INTO item(nom, categorie, image, prix, description)
VALUES('Tom Kha Goong', 'Soupes', 'tom-kha-goong.jpg','7.0','Potage au lait de noix de coco et aux crevettes');

INSERT INTO item(nom, categorie, image, prix, description)
VALUES('Tom Yum Gai', 'Soupes', 'tom-yum-gai.jpg','7.0','Boullion ?? la citronnelle et au poulet');

INSERT INTO item(nom, categorie, image, prix, description)
VALUES('Tom Kha Gai', 'Soupes', 'tom-kha-gai.jpg','7.0','Potage au lait de noix de coco et au poulet');

INSERT INTO item(nom, categorie, image, prix, description)
VALUES('Tom Yum Talay', 'Soupes', 'tom-yum-talay.jpg','7.5','Boullion ?? la citronnelle et aux fruits de mer');

-- ---------------------- ENTREE -------------------------------------------------------------------------
INSERT INTO item(nom, categorie, image, prix, description)
VALUES('Poa Pia Goong Tod', 'Entr??es', 'poa-pia-goong-tod.jpg','10.0','Rouleaux frits aux crevettes enti??res avec sauce aigre-douce');

INSERT INTO item(nom, categorie, image, prix, description)
VALUES('Poa Pia Gai Tod', 'Entr??es', 'poa-pia-gai-tod.jpg','10.0','Rouleaux frits au poulet et l??gumes avec sauce aigre-douce');

INSERT INTO item(nom, categorie, image, prix, description) 
VALUES('Tao Hoo Tod', 'Entr??es', 'tao-hoo-tod.jpg','10.0','Tofu frit servi avec sauce aigre-douce aux arachides');

INSERT INTO item(nom, categorie, image, prix, description)
VALUES('Tod Man Pla', 'Entr??es', 'tod-man-pla.jpg','10.0','Galettes de poisson frites avec sauce aigre-douce');

INSERT INTO item(nom, categorie, image, prix, description)
VALUES('Satay', 'Entr??es', 'satay.jpg','10.0','Brochettes au poulet avec sauce arachides');

INSERT INTO item(nom, categorie, image, prix, description)
VALUES('Poa Pia Tod', 'Entr??es', 'poa-pia-tod-du-chef.jpg','12.0','Rouleaux frits aux crevettes hach??es avec sauce aigre-douce');

INSERT INTO item(nom, categorie, image, prix, description)
VALUES('Gai Tod', 'Entr??es', 'gai-tod.jpg','12.0','Ailes de poulet farcis de vermicelle avec sauce aigre-douce');

INSERT INTO item(nom, categorie, image, prix, description)
VALUES('Poa Pia Jay', 'Entr??es', 'poa-pia-jay.jpg','10.0','Rouleaux frits v??g??tariens servi avec sauce aigre-douce');

INSERT INTO item(nom, categorie, image, prix, description)
VALUES('Gai Haw Bai Toey', 'Entr??es', 'gai-haw-bai-toey.jpg','12.0','Poulet marin?? dans une feuille de pandanus');

INSERT INTO item(nom, categorie, image, prix, description)
VALUES('Pla Muek Tod', 'Entr??es', 'pla-muek-tod.jpg','12.0','Calmars frits servi avec sauce aigre-douce');

-- -----------------------------SALADE-------------------------------------------------------------------------
INSERT INTO item(nom, categorie, image, prix, description)
VALUES('Yum Talay', 'Salades', 'yum-talay.jpg','20.0','Salade de fruits de mer avec sauce limette ??pic??e');

INSERT INTO item(nom, categorie, image, prix, description)
VALUES('Yum Woon Sen', 'Salades', 'yum-woon-sen.jpg','20.0','Salade de fruits de mer avec vermicelle et sauce limette');

INSERT INTO item(nom, categorie, image, prix, description)
VALUES('Neua Nam Tok', 'Salades', 'neua-nam-tok.jpg','18.0','Salade de b??uf barbecue ??minc?? ?? la menthe piment??e');

INSERT INTO item(nom, categorie, image, prix, description)
VALUES('Larb Gai', 'Salades', 'larb-gai.jpg','18.0','Salade de poulet hach?? servi avec sauce limette ??pic??e');

-- ---------------------- FRUITS DE MER -----------------------------------------------------------------------------
INSERT INTO item(nom, categorie, image, prix, description)
VALUES('Tod Kartiem Prik Thai', 'Fruits De Mer', 'tod-kartiem-prik-thai.jpg','20.0','Saut?? de fruits de mer avec ail, poivre, coriandre et soya');

INSERT INTO item(nom, categorie, image, prix, description)
VALUES('Pad Ga Prao Ma Kua Yao', 'Fruits De Mer', 'pad-ga-prao-ma-kua-yao.jpg','20.0','Saut?? de crevettes et aubergines avec piments forts et basilic');

INSERT INTO item(nom, categorie, image, prix, description)
VALUES('Goong Pad Med Ma Muang', 'Fruits De Mer', 'goong-pad-med-ma-muang.jpg','20.0','Saut?? de crevettes aux noix de cajou, ail et oignons');

INSERT INTO item(nom, categorie, image, prix, description)
VALUES('Pad Priew Wan Goong', 'Fruits De Mer', 'pad-priew-wan-goong.jpg','20.0','Saut?? de crevettes aigre-douce avec ananas');

INSERT INTO item(nom, categorie, image, prix, description)
VALUES('Pad Woon Sen Talay', 'Fruits De Mer', 'pad-woon-sen-talay.jpg','20.0','Saut?? de vermicelle aux fruits de mer');

-- ---------------------- CARI -------------------------------------------------------------------------------
INSERT INTO item(nom, categorie, image, prix, description)
VALUES('Gang Khiao Wan', 'Cari', 'green-curry.jpg','18.0','Cari vert au poulet avec pousses de bambou, poivrons et basilic');

INSERT INTO item(nom, categorie, image, prix, description)
VALUES('Gang Garee', 'Cari', 'yellow-curry.jpg','18.0','Cari jaune au poulet avec pousses de bambou, poivrons et basilic');

INSERT INTO item(nom, categorie, image, prix, description)
VALUES('Gang Dang', 'Cari', 'red-curry.jpg','18.0','Cari rouge au poulet avec pousses de bambou, poivrons et basilic');

-- ---------------------- SAUTEE --------------------------------------------------------------------------
INSERT INTO item(nom, categorie, image, prix, description)
VALUES('Pad Kra Prao', 'Saut??s', 'pad-kra-prao.jpg','18.0','Saut?? de basilic avec piments forts et l??gumes');

INSERT INTO item(nom, categorie, image, prix, description)
VALUES('Pad Khing', 'Saut??s', 'pad-khing.jpg','16.0','Saut?? au poulet avec gingembre, ail, oignons et poivrons');

INSERT INTO item(nom, categorie, image, prix, description)
VALUES('Poulet Frit Avec Sauce Au Citron', 'Saut??s', 'poulet-au-citron.jpg','16.0','Poitrine de poulet frit avec sauce au citron maison');

INSERT INTO item(nom, categorie, image, prix, description)
VALUES('Poulet G??n??ral Tao', 'Saut??s', 'poulet-general-tao.jpg','18.0','Poulet frit saut?? avec sauce maison samorn');

INSERT INTO item(nom, categorie, image, prix, description)
VALUES('Pad Ped Moo', 'Saut??s', 'pad-ped-moo.jpg','18.0','Saut?? de porc avec poudre de cari rouge et l??gumes servi avec riz');

INSERT INTO item(nom, categorie, image, prix, description)
VALUES('Pad Neua Nam Mun Hoy', 'Saut??s', 'pad-neua-nam-mun-hoy.jpg','16.0','Saut?? au boeuf avec sauce aux huitres');

INSERT INTO item(nom, categorie, image, prix, description)
VALUES('Pad Neua Tra Khi', 'Saut??s', 'pad-neua-tra-khi.jpg','16.0','Saut?? au boeuf ?? la citronnelle servi sur riz');

INSERT INTO item(nom, categorie, image, prix, description)
VALUES('Pad Toie Run Tao', 'Saut??s', 'saute-de-pois-mange-tout.jpg','10.0','Saut?? de pois mange-tout');

INSERT INTO item(nom, categorie, image, prix, description)
VALUES('Pad Kra Prao', 'Saut??s', 'pad-kra-prao.jpg','17.0','Saut?? d???haricots verts, piments forts et basilic servi sur riz');

-- ---------------------- RIZ FRIT ------------------------------------------------------------------------------------
INSERT INTO item(nom, categorie, image, prix, description)
VALUES('Kao Pad Talay', 'Riz Frit', 'kao-pad-talay.jpg','20.0','Riz frit aux fruits de mer avec oignons verts');

INSERT INTO item(nom, categorie, image, prix, description)
VALUES('Koa Pad Gai', 'Riz Frit', 'koa-pad-gai.jpg','18.0','Riz frit au poulet avec oignons verts');

INSERT INTO item(nom, categorie, image, prix, description)
VALUES('Kao Pad Sub Pa Rod', 'Riz Frit', 'kao-pad-sub-pa-rod.jpg','20.0','Riz frit aux ananas avec fruits de mer au cari');

INSERT INTO item(nom, categorie, image, prix, description)
VALUES('Kao Pad Pu', 'Riz Frit', 'kao-pad-pu.jpg','20.0','Riz frit au crabe avec oignons verts');

-- ---------------------- NOUILLES ---------------------------------------------------------------------------------------------
INSERT INTO item(nom, categorie, image, prix, description)
VALUES('Pad Thai Goong', 'Nouilles', 'pad-thai-goong.jpg','20.0','Nouilles de riz saut??es avec crevettes, sauce pad thai maison et f??ves germ??es');

INSERT INTO item(nom, categorie, image, prix, description)
VALUES('Pad Thai Gai', 'Nouilles', 'pad-thai-gai.jpg','20.0','Nouilles de riz saut??es avec poulet, sauce pad thai maison et f??ves germ??es');

INSERT INTO item(nom, categorie, image, prix, description)
VALUES('Pad Thai Jay', 'Nouilles', 'pad-thai-jay.jpg','18.0','Nouilles de riz saut??es avec l??gumes, sauce pad thai maison et f??ves germ??es');

INSERT INTO item(nom, categorie, image, prix, description)
VALUES('Pad Kee Mao', 'Nouilles', 'pad-kee-mao.jpg','20.0','Nouilles de riz saut??es avec poulet, basilic et piments forts et l??gumes');

INSERT INTO item(nom, categorie, image, prix, description)
VALUES('Rad NA', 'Nouilles', 'rad-na.jpg','20.0','Nouilles de riz garnie d\'une sauce brune maison');

INSERT INTO item(nom, categorie, image, prix, description)
VALUES('Pad See Ew', 'Nouilles', 'pad-see-ew.jpg','20.0','Nouilles de riz saut??es avec poulet, sauce soya noire et brocolis chinois');

-- ---------------------- VEGETARIEN ---------------------------------------------------------------------------------------------
INSERT INTO item(nom, categorie, image, prix, description)
VALUES('Pad Pak Ruam Mit', 'V??g??tarien', 'pad-pak-ruam-mit.jpg','14.0','Saut?? de l??gumes avec choux chinois et bok choy');

INSERT INTO item(nom, categorie, image, prix, description)
VALUES('Pad Kha Na', 'V??g??tarien', 'pad-kha-na.jpg','14.0','Saut?? de brocolis chinois');

INSERT INTO item(nom, categorie, image, prix, description)
VALUES('Kao Pad Jay', 'V??g??tarien', 'kao-pad-jay.jpg','16.0','Riz frit avec carottes, brocolis et chou-fleurs');

INSERT INTO item(nom, categorie, image, prix, description)
VALUES('Pad Thai Jay', 'V??g??tarien', 'pad-thai-jay.jpg','18.0','Nouilles de riz saut??es avec l??gumes, sauce pad thai maison et f??ves germ??es');

-- ---------------------- DESSERTS ---------------------------------------------------------------------------------------------
INSERT INTO item(nom, categorie, image, prix, description)
VALUES('Banane Frite', 'Desserts', 'banane-frite.jpg','8.0','Servi avec sirop d\'??rable et cr??me glac??e');

INSERT INTO item(nom, categorie, image, prix, description)
VALUES('Pomme Frite', 'Desserts', 'pomme-frite.jpg','8.0','Servi avec sirop d\'??rable et cr??me glac??e');

INSERT INTO item(nom, categorie, image, prix, description)
VALUES('Ananas Frit', 'Desserts', 'ananas-frit.jpg','8.0','Servi avec sirop d\'??rable et cr??me glac??e');

INSERT INTO item(nom, categorie, image, prix, description)
VALUES('Cr??me Caramel Maison', 'Desserts', 'creme-caramel.jpg','8.0','Servi avec sirop d\'??rable');




