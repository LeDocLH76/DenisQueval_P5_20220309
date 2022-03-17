const listeProduits = "http://localhost:3000/api/products";

// Recupere l'ensemble des articles disponibles sur le serveur
fetch(listeProduits)
    .then(function (res) {
        if (res.ok) {
            return res.json();
        }
    })
    .then(function (value) {
        //Tout le reste se passe ici
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
            //Incremente le prix total et le nombre d'articles
            if (article.name == element.nom) {
                quantiteTotale += parseInt(element.quantite);
                prixTotal += article.price * parseInt(element.quantite);
                contenuPanierDom += constructionElementDOM(element, article);
            }
        }
    }

    //Remplir le dom avec l'aglomerat d'éléments créé
    let cibleDom = document.getElementById("cart__items");
    cibleDom.innerHTML = contenuPanierDom;
    majQuantiteDom(quantiteTotale);
    majPrixDom(prixTotal);

    //Pour tout les articles dans la page
    //Ajoute un ecouteur sur la quantite qui modifie le localStorage en fonction
    for (let index = 0; index < panier.length; index++) {
        cibleDom.children[index].querySelector(".itemQuantity").addEventListener("change", function () {
            let cibleDom = document.getElementById("cart__items");
            let id = cibleDom.children[index].dataset.id;
            let couleur = cibleDom.children[index].dataset.color;
            let quantite = parseInt(cibleDom.children[index].querySelector(".itemQuantity").value);
            cibleDom.children[index].querySelector(".itemQuantity").value = quantite;
            if (quantite > 0 & quantite <= 100 ){
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
            }else{
                cibleDom.children[index].querySelector(".itemQuantity").value = panier[index].quantite;
            }
        });
        //Ajoute un ecouteur sur la suppression qui modifie le localStorage en fonction et recharge la page
        cibleDom.children[index].querySelector(".deleteItem").addEventListener("click", function () {
            let cibleDom = document.getElementById("cart__items");
            let id = cibleDom.children[index].dataset.id;
            let couleur = cibleDom.children[index].dataset.color;
            retirerLocalStorage(panier, id, couleur);
        });
    }

    let tableVerification = [
        {label:"firstName",labelMessage:"firstNameErrorMsg",regExp:"Denis",message:"Message erreur prénom",valide:false},
        {label:"lastName",labelMessage:"lastNameErrorMsg",regExp:"QUEVAL",message:"Message erreur nom",valide:false},
        {label:"address",labelMessage:"addressErrorMsg",regExp:"128",message:"Message erreur adresse",valide:false},
        {label:"city",labelMessage:"cityErrorMsg",regExp:"LH",message:"Message erreur ville",valide:false},
        {label:"email",labelMessage:"emailErrorMsg",regExp:"moi@labas",message:"Message erreur email",valide:false}        
    ];
   
    tableVerification.forEach(element => {
        let cible = document.getElementById(element.label);
        // console.log(cible);
        let messageCible = document.getElementById(element.labelMessage)
        // console.log(messageCible);
        cible.addEventListener("change", function () {
            if (cible.value == element.regExp){
                console.log("Coucou, j'ai changé de prénom!");
                element.valide = true;
            }else{
                console.log("entrée non autorisée!");
                cible.value = "";
                messageCible.innerHTML = element.message;
                element.valide = false;
                // console.log(element.message);
            }

        });
        cible.addEventListener("click", function () {
            messageCible.innerHTML = "";
        });
    });

    document.getElementById("order").addEventListener("click", function(e){
        e.preventDefault();
        let flagCommander = true;
        tableVerification.forEach(element => {
            console.log(element.valide);
            if (element.valide == false){
                flagCommander = false;
            }
        });
        if (flagCommander == true){
            alert("Passer la commande");
        }else{
            alert("Le formulaire n'est pas bien rempli!");
        }
    })

    //Debut du traitement du formulaire**************************
    

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
            //Si present, efface cartAndFormContainer de l'adresse de la page
            window.location.hash = "";
            panier.splice(index, 1);
            majLocalStorage(panier);
            //Insere cartAndFormContainer dans l'adresse de la page
            window.location.hash = "cartAndFormContainer"
            //Force le rechargement de la page au niveau du haut du panier
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
    contenuUnElement = `
    <article class="cart__item" data-id="${element.id}" data-color="${element.couleur}">\n
    <div class="cart__item__img">\n
    <img src="${article.imageUrl}" alt="${article.altTxt}">\n
    </div>\n
    <div class="cart__item__content">\n
    <div class="cart__item__content__description">\n
    <h2>${element.nom}</h2>\n
    <p>${element.couleur}</p>\n
    <p>${article.pric} €</p>\n
    </div>\n
    <div class="cart__item__content__settings">\n
    <div class="cart__item__content__settings__quantity">\n
    <p>Qté : </p>\n
    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${element.quantite}">\n
    </div>\n
    <div class="cart__item__content__settings__delete">\n
    <p class="deleteItem">Supprimer</p>\n
    </div>\n
    </div>\n
    </div>\n
    </article>\n
    `;
    return contenuUnElement
}

function lireLocalStorage() {
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

  
    // console.log("ID enfant = " + cibleDom.children[index].dataset.id + " couleur enfant = " + cibleDom.children[index].dataset.color);
    // console.log(cibleDom.children[index]);
    // console.log(typeof parseInt(cibleDom.children[index].querySelector(".itemQuantity").value) );
