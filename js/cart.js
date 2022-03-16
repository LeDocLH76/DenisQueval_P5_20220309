const listeProduits = "http://localhost:3000/api/products";

// Recupere l'ensemble des articles disponibles sur le serveur
fetch(listeProduits)
    .then(function (res) {
        if (res.ok) {
            return res.json();
        }
    })
    .then(function (value) {
        resteDuScript(value)
    })
    .catch(function (err) {
        console.log(err);
    })
    ;

function resteDuScript(contenuMagasin) {
    let contenuPanierDom = "";
    let quantiteTotale = 0;
    let prixTotal = 0
    let panier = lireLocalStorage();
    //Tri du panier sur le nom
    trierPanier(panier);

    //Pour chaque element dans le panier
    for (let index = 0; index < panier.length; index++) {
        const element = panier[index];
        //Pour chaque article dans contenuMagasin
        for (let index = 0; index < contenuMagasin.length; index++) {
            const article = contenuMagasin[index];
            //Si egaux construire un element du dom et aglomerer à l'existant
            if (article.name == element.nom) {
                // console.log("Match " + element.nom + " Prix " + article.price + " €");
                quantiteTotale += parseInt(element.quantite);
                prixTotal += article.price * parseInt(element.quantite);
                // console.log("Quantité totale = " + quantiteTotale);
                // console.log("Prix total = " + prixTotal + " €");
                contenuPanierDom += constructionElementDOM(element, article);
            }
        }
    }
    //Remplir le dom avec l'aglomerat d'elements créé
    let cibleDom = document.getElementById("cart__items");
    cibleDom.innerHTML = contenuPanierDom;
    majQuantiteDom(quantiteTotale);
    majPrixDom(prixTotal);
  
    // console.log("ID enfant = " + cibleDom.children[index].dataset.id + " couleur enfant = " + cibleDom.children[index].dataset.color);
    // console.log(cibleDom.children[index]);
    // console.log(typeof parseInt(cibleDom.children[index].querySelector(".itemQuantity").value) );

    //Pour tout les articles dans la page
    //Ajoute un ecouteur sur la quantite qui modifie le localStorage en fonction
    for (let index = 0; index < panier.length; index++) {
        cibleDom.children[index].querySelector(".itemQuantity").addEventListener("change", function () {
            let cibleDom = document.getElementById("cart__items");
            let id = cibleDom.children[index].dataset.id;
            let couleur = cibleDom.children[index].dataset.color;
            let quantite = cibleDom.children[index].querySelector(".itemQuantity").value;
            //Met à jour la quantité totale sur la page
            let quantitePanier = panier[index].quantite;
            let differenceQuantite = quantitePanier - quantite;
            quantiteTotale -= differenceQuantite;
            majQuantiteDom(quantiteTotale);
            //Met à jour le prix total sur la page
            let prixArticle = trouvePrixArticle(contenuMagasin, id);
            prixTotal -= differenceQuantite * prixArticle;
            majPrixDom(prixTotal);
            //Modifie la quantité dans le localStorage
            modifierQuantité(panier, id, couleur, quantite);
        });
        //Ajoute un ecouteur sur la suppression qui modifie le localStorage en fonction et recharge la page
        cibleDom.children[index].querySelector(".deleteItem").addEventListener("click", function () {
            console.log("Clic supprimer");
            let cibleDom = document.getElementById("cart__items");
            let id = cibleDom.children[index].dataset.id;
            let couleur = cibleDom.children[index].dataset.color;
            retirerLocalStorage(panier, id, couleur);
        });
    }
}



//Definitions de fonctions***************************************

function trouvePrixArticle(contenuMagasin, id) {
    for (let index = 0; index < contenuMagasin.length; index++) {
        const element = contenuMagasin[index];
        if (element._id == id) {
            console.log(typeof element.price);
            return element.price
        }
    }
}

function majPrixDom(prixTotal) {
    cibleDom = document.getElementById("totalPrice");
    cibleDom.innerHTML = prixTotal;
}

function majQuantiteDom(quantiteTotale) {
    cibleDom = document.getElementById("totalQuantity");
    cibleDom.innerHTML = quantiteTotale;

}

function retirerLocalStorage(panier, id, couleur) {
    for (let index = 0; index < panier.length; index++) {
        const element = panier[index];
        if (element.id == id & element.couleur == couleur) {
            panier.splice(index, 1);
            majLocalStorage(panier);
            location.reload();
        }
    }
}

function modifierQuantité(panier, id, couleur, quantite) {
    panier.forEach(element => {
        if (element.id == id & element.couleur == couleur) {
            element.quantite = quantite;
            majLocalStorage(panier);
        }
    });
}

function majLocalStorage(panier) {
    let panierJson = JSON.stringify(panier);
    localStorage.setItem("panierKanap", panierJson);
    console.log("Panier mis à jour");
}

function trierPanier(panier) {
    panier.sort(function compare(a, b) {
        if (a.nom < b.nom)
            return -1;
        if (a.nom > b.nom)
            return 1;
        return 0;
    });
}

function constructionElementDOM(element, article) {
    contenuUnElement = "";
    contenuUnElement += '<article class="cart__item" data-id="' + element.id + '" data-color="' + element.couleur + '">\n';
    contenuUnElement += '<div class="cart__item__img">\n';
    contenuUnElement += '<img src="' + article.imageUrl + '" alt="' + article.altTxt + '">\n';
    contenuUnElement += '</div>\n'
    contenuUnElement += '<div class="cart__item__content">\n';
    contenuUnElement += '<div class="cart__item__content__description">\n';
    contenuUnElement += '<h2>' + element.nom + '</h2>\n';
    contenuUnElement += '<p>' + element.couleur + '</p>\n';
    contenuUnElement += '<p>' + article.price + ' €</p>\n';
    contenuUnElement += '</div>\n';
    contenuUnElement += '<div class="cart__item__content__settings">\n';
    contenuUnElement += '<div class="cart__item__content__settings__quantity">\n';
    contenuUnElement += '<p>Qté : </p>\n';
    contenuUnElement += '<input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="' + element.quantite + '">\n';
    contenuUnElement += '</div>\n';
    contenuUnElement += '<div class="cart__item__content__settings__delete">\n';
    contenuUnElement += '<p class="deleteItem">Supprimer</p>\n';
    contenuUnElement += '</div>\n';
    contenuUnElement += '</div>\n';
    contenuUnElement += '</div>\n';
    contenuUnElement += '</article>\n';
    return contenuUnElement
}

function lireLocalStorage() {
    console.log("Fonction lire LS");
    return JSON.parse(localStorage.getItem("panierKanap"));
}





// const getUnProduit = async function (url) {
//     try {
//         const response = await fetch(url);
//         if (response.ok) {
//             const data = await response.json();
//             console.log("1");
//             console.log(data);
//         } else {
//             console.error("Retour du serveur : ", response.status);
//         }

//     } catch (error) {
//         console.log(error);
//     }
// }

// getUnProduit("http://localhost:3000/api/products/055743915a544fde83cfdfc904935ee7").then(function(response){
//     console.log("2");
//     console.log(response);
// });
// console.log("3")


// const get = function("http://localhost:3000/api/products/055743915a544fde83cfdfc904935ee7"){

// }