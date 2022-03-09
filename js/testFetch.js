// Premier test d'extraction de données sur le serveur

const pageProduct = "http://localhost:3000/api/products";

// Recupere l'ensemble des articles disponibles sur le serveur
fetch(pageProduct)
    .then(function (res) {
        if (res.ok) {
            return res.json();
        }
    })
    .then(function (value) {
        let blocElementsDom = aglomerationElementsDOM(value)
        let pointInsertion = document.getElementById("items");
        pointInsertion.innerHTML = blocElementsDom
    })
    .catch(function (err) {
        console.log(err);
    })
    ;

// Pour test >> a supprimer
function afficheLesProduits(produits) {
    console.log("Longueur du tableau " + produits.length)
    for (let index = 0; index < produits.length; index++) {
        const element = produits[index];
        console.log("index = " + index)
        console.log(element.name);
        console.log(element.description);
        console.log(element.colors);
        console.log(element.price);
        console.log(element._id);
        console.log(element.altTxt);
        console.log(element.imageUrl);
    }
}

// Parcours la liste des produits disponibles
// et aglomere les differentes cartes article
function aglomerationElementsDOM(produits) {
    let blocElementsDom = "";
    for (let index = 0; index < produits.length; index++) {
        const element = produits[index];
        // appel de la fonction de construction d'une carte
        blocElementsDom += constructionElementDOM(element);
    }
    return blocElementsDom
}

// Prepare les elements du DOM pour une carte article
function constructionElementDOM(produit) {
    let element = "";
    element += '<a href="./product.html?id=' + produit._id + '">\n';
    element += '<article>\n';
    element += '<img src="' + produit.imageUrl + '" alt="' + produit.altTxt + ', ' + produit.name + '">\n';
    element += '<h3 class="productName">' + produit.name + '</h3>\n';
    element += '<p class="productDescription">' + produit.description + '</p>\n';
    element += '</article>\n';
    element += '</a>\n';
    return element;
}