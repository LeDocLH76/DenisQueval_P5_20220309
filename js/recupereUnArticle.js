let pageCourante = window.location.href;
let url = new URL(pageCourante);
console.log("url = " + url);
let productId = url.searchParams.get("id");
console.log("Numéro du produit = " + productId);
const listeProduits = "http://localhost:3000/api/products";
const urlUnProduit = listeProduits + "/" + productId;
console.log("1 " + urlUnProduit);


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
    let produit = {
        nom: value.name,
        id: productId,
        couleur: "",
        quantite: 0
    };

    let boutonAjouter = document.getElementById("addToCart");
    boutonAjouter.addEventListener("click", function ajoutePanier() {
        console.log("Je suis dans l'ajout au panier.");
        // console.log("L'id produit est: " + produit.id);
        // console.log("Le nom du produit est: " + produit.nom);
        lireCouleur(produit, value);
        quantite = lireQuantite(produit);
        if (produit.couleur == "" | quantite < 1) {
            alert("Veuillez indiquer une couleur et une quantité.");
        } else {
            console.log(produit);
            valideArticle(produit);
        }
    });
    console.log("C'est la fin!....")
}
// A finir doublon??? dans le ls
function compareIdLocalStorage(produit) {
    let contenuLocalStorage = lireLocalStorage();
    console.log("contenu du LS = " + contenuLocalStorage);
    contenuLocalStorage.forEach(element => {
        console.log("boucle compare")
        if (element.id == produit.id) {
            console.log("Un id identique est déja dans le panier");
            if (element.couleur == produit.couleur){
                console.log("La couleur est identique");
            }else{
                console.log("else couleur");
                ajouteLocalStorage(produit);
            }
        } else {
            console.log("else id");
            ajouteLocalStorage(produit);
        }
    });

}

function ajouteLocalStorage(produit) {
    console.log("ajoute au LS");
    // produit est un objet que l'on doit ajouter au tableau panier;
    let panier = lireLocalStorage();
    console.log("Produit dans ajoute LS = " + produit);
    console.log("Panier dans ajoute LS = " + panier);
    panier.push(produit);
    let panierJson = JSON.stringify(panier);
    console.log("panierJson = " + panierJson);
    localStorage.setItem("panierKanap", panierJson);
    alert("Produit ajouté!");
}

function lireLocalStorage() {
    console.log("Le storage avant parse = " + localStorage.getItem("panierKanap"));
    console.log("Le storage apres parse = " + JSON.parse(localStorage.getItem("panierKanap")));

    return JSON.parse(localStorage.getItem("panierKanap"));
}

function valideArticle(produit) {
    console.log("Coucou je suis ajout au locaStorage");
    let panier = lireLocalStorage();
    console.log(panier);
    if (panier == null) {
        let panierJson = JSON.stringify([produit]);
        console.log("panierJson = " + panierJson);
        localStorage.setItem("panierKanap", panierJson);
        alert("Panier créé!");

    } else {
        console.log("Le panier contient déja qqc");
        compareIdLocalStorage(produit);
    }
}

function lireCouleur(produit, value) {
    let cibleCouleur = document.querySelector("#colors");
    // console.log("L'index de la couleur est: " + cibleCouleur.selectedIndex);
    // console.log("La cible contient: " + value.colors[cibleCouleur.selectedIndex -1 ]);
    if (cibleCouleur.selectedIndex == 0) {
        console.log("Veuillez choisir une couleur!");
        produit.couleur = "";
    } else {
        console.log("La couleur choisie est: " + value.colors[cibleCouleur.selectedIndex - 1]);
        produit.couleur = value.colors[cibleCouleur.selectedIndex - 1];
    };
}

function lireQuantite(produit) {
    let cibleQuantite = document.querySelector("#quantity");
    // console.log("Cible quantité = " + cibleQuantite);
    // console.log("Valeur de cibleQuantite = " + cibleQuantite.value);
    // console.log(typeof parseInt(cibleQuantite.value));
    let quantite = parseInt(cibleQuantite.value);

    if (quantite < 1 | quantite > 100) {
        console.log("Veuillez choisir une quantité!");
        produit.quantite = 0;
        cibleQuantite.value = 0;
    } else {
        console.log("La quantité est: " + quantite);
        produit.quantite = quantite;
    };

    return quantite;

}

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

