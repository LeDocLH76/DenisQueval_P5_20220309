let pageCourante = window.location.href;
let url = new URL(pageCourante);
// console.log("url = " + url);
let productId = url.searchParams.get("id");
// console.log("Numéro du produit = " + productId);
const listeProduits = "http://localhost:3000/api/products";
const urlUnProduit = listeProduits + "/" + productId;
// console.log("1 " + urlUnProduit);

// trouveUnProduit(urlUnProduit);
// console.log("5 En retour de fetch mon produit = " + monProduit);
// remplirLeDom(monProduit);

// async function trouveUnProduit(urlUnProduit) {
//     console.log("2 Dans trouve un produit " + urlUnProduit);
//     let resultat = await fetch(urlUnProduit);
//     console.log("3 Apres fetch resultat = " + resultat);
//     let monProduit = await resultat.json();
//     console.log("4 Apres fetch mon produit = " + monProduit);
//     remplirLeDom(monProduit);
// }
// console.log("5 Apres tout le bazard!");

// Recuperation des informations sur un produit.
fetch(urlUnProduit)
    .then(function (res) {
        if (res.ok) {
            return res.json();
        }
    })
    .then(function (value) {
        remplirLeDom(value);
        console.log("Le DOM est rempli.");
        resteDuScript(value);
    })
    .catch(function (err) {
        console.log(err);
    });


// Le reste dans une fonction pour ne pas etre bloqué
// C'est a modifier plus tard des que le async await sera compris!
function resteDuScript(value) {
    //Definition de l'objet produit utilisé pour remplir le panier
    let produit = {
        nom: value.name,
        id: productId,
        couleur: "",
        quantite: 0
    };

    //Ecoute le bouton ajouter
    let boutonAjouter = document.getElementById("addToCart");
    boutonAjouter.addEventListener("click", function ajoutePanier() {
        console.log("Clic ajout au panier.");
        //Lire et modifier la couleur du produit courant
        lireCouleur(produit, value);
        //Lire et filtrer la quantité
        quantite = lireQuantite(produit);
        if (produit.couleur == "" | quantite == 0) {
            alert("Veuillez indiquer une couleur et une quantité.");
        } else {
            valideArticle(produit);
        }
        //Efface la quantier sur le formulaire pour eviter une double entrée.
        razQuantite();
    });
    console.log("CTA");
}

//Compare le produit à ajouter avec ceux contenus dans le loalStorage
function compareIdLocalStorage(produit) {
    console.log("Fonction compare");
    let contenuLocalStorage = lireLocalStorage();
    let flagPresent = false, flagCouleur = false, position = 0;
    //Parcours le contenu du localStorage
    for (let index = 0; index < contenuLocalStorage.length; index++) {
        const element = contenuLocalStorage[index];
        //Si id déja present, leve le drapeau
        if (element.id == produit.id) {
            flagPresent = true;
        }
        //Si couleur identique, leve le drapeau et memorise la position dans le tableau
        if (element.couleur == produit.couleur) {
            flagCouleur = true;
            position = index;
        }
    }
    //Si le produit à ajouter est déja present de la meme couleur
    if (flagPresent & flagCouleur) {
        console.log("Mise a jour de la quantité");
        //Mettre à jour la quantité
        contenuLocalStorage[position].quantite += produit.quantite;
    //Le produit à ajouter n'est pas present, ou pas de la meme couleur
    } else {
        //ajoute le produit au tableau
        contenuLocalStorage.push(produit);
    }
    //Met à jour toujours
    majLocalStorage(contenuLocalStorage);
}


function majLocalStorage(panier) {
    console.log("Fonction maj du LS");
    let panierJson = JSON.stringify(panier);
    localStorage.setItem("panierKanap", panierJson);
    console.log("Panier mis à jour");
}

function lireLocalStorage() {
    console.log("Fonction lire LS");
    return JSON.parse(localStorage.getItem("panierKanap"));
}

function valideArticle(produit) {
    console.log("Fonction valide article");
    let panier = lireLocalStorage();
    //Si le panier est vide, création du premier enregistrement
    if (panier == null) {
        let panierJson = JSON.stringify([produit]);
        localStorage.setItem("panierKanap", panierJson);
        console.log("Panier créé!");
    //Si le panier contient quelque chose
    } else {
        console.log("Le panier contient déja qqc");
        //On compare et on met à jour le panier suivant ce qu'il contient déja
        compareIdLocalStorage(produit);
    }
    //Retour en attente d'action utilisateur
}

//Lire la couleur et l'affecter au produit
function lireCouleur(produit, value) {
    console.log("Fonction lire couleur");
    let cibleCouleur = document.querySelector("#colors");
    //Pas de couleur selectionnée
    if (cibleCouleur.selectedIndex == 0) {
        console.log("Veuillez choisir une couleur!");
        produit.couleur = "";
    //Affecte la couleur à l'index -1 dans le tableau de couleur recuperé sur le serveur à produit.couleur
    } else {
        // console.log("La couleur choisie est: " + value.colors[cibleCouleur.selectedIndex - 1]);
        produit.couleur = value.colors[cibleCouleur.selectedIndex - 1];
    };
}

//Remet à 0 la quantité du formulaire
function razQuantite() {
    console.log("Fonction raz quantité");
    let cibleQuantite = document.querySelector("#quantity");
    cibleQuantite.value = 0;
}

//Lit la quantité du formulaire
function lireQuantite(produit) {
    console.log("Fontion lire quantité");
    let cibleQuantite = document.querySelector("#quantity");
    //Transforme en nombre
    let quantite = parseInt(cibleQuantite.value);
    //Verifie la validité
    if (quantite < 1 | quantite > 100 | quantite == NaN) {
        quantite = 0;
        produit.quantite = 0;
        cibleQuantite.value = 0;
    //Si valide l'affecte au produit
    } else {
        produit.quantite = quantite;
    };
    //Et la retourne
    return quantite;
}

//Replir le Dom avec les infos retounées par le serveur
function remplirLeDom(produit) {
    let insertion1 = document.getElementsByClassName("item__img");
    let elementCible = insertion1[0];
    elementCible.innerHTML = '<img src="' + produit.imageUrl + '" alt="' + produit.altTxt + '">\n';

    elementCible = document.getElementById("title");
    elementCible.innerHTML = produit.name;

    elementCible = document.getElementById("price");
    elementCible.innerHTML = produit.price;

    elementCible = document.getElementById("description");
    elementCible.innerHTML = produit.description;

    elementCible = document.getElementById("colors");
    let contenuDom = '<option value="">--SVP, choisissez une couleur --</option>\n';
    produit.colors.forEach(element => {
        contenuDom += '<option value="' + element + '">' + element + '</option>\n';
    });
    elementCible.innerHTML = contenuDom;
}

