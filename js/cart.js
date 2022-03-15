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

function resteDuScript(value) {
    let contenuPanierDom = "";
    let prixTotal = 0
    let panier = lireLocalStorage();
    //Tri du panier sur le nom
    trierPanier(panier);
    let contenuMagasin = value;
    //Pour chaque element dans le panier
    for (let index = 0; index < panier.length; index++) {
        const element = panier[index];
        //Pour chaque article dans contenuMagasin
        for (let index = 0; index < contenuMagasin.length; index++) {
            const article = contenuMagasin[index];
            // console.log("Magasin " + article.name);
            //Si egaux construire un element du dom et aglomerer à l'existant
            if (article.name == element.nom) {
                console.log("Match " + element.nom + " Prix " + article.price + " €");
                prixTotal += article.price * element.quantite;
                console.log("Prix total = " + prixTotal + " €");
                contenuPanierDom += constructionElementDOM(element, article);
            }
        }
        // console.log("Panier " + element.nom);
    }
    let cibleDom = document.getElementById("cart__items");
    cibleDom.innerHTML = contenuPanierDom;

    cibleDom = document.getElementById("totalPrice");
    cibleDom.innerHTML = prixTotal;
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
    contenuUnElement += '<article class="cart__item" data-id="{' + element.id + '}" data-color="{' + element.couleur + '}">\n';
    contenuUnElement += '<div class="cart__item__img">\n';
    contenuUnElement += '<img src="' + article.imageUrl + '" alt="Photographie d\'un canapé">\n';
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