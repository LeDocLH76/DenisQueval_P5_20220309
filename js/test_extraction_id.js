let pageCourante = window.location.href;
let url = new URL(pageCourante);
console.log("url = " + url);
let productId = url.searchParams.get("id");
console.log("Numéro du produit" + productId);

const listeProduits = "http://localhost:3000/api/products";

// Recupere l'ensemble des articles disponibles sur le serveur
fetch(listeProduits)
    .then(function (res) {
        if (res.ok) {
            return res.json();
        }
    })
    .then(function (value) {
        // console.log("Dans then id de produit = " + productId);
        let produitCourant = trouveLeProduit(productId, value);
        // console.log(typeof produitCourant);
        if (produitCourant == -1) {
            console.log("Produit non trouvé");
        }
        // console.log("Dans then\n");
        // afficheUnProduit(value[produitCourant]);
        remplirLeDom(value[produitCourant]);
    })
    .catch(function (err) {
        console.log(err);
    });

function trouveLeProduit(id, produits) {
    // console.log("Dans trouve un produit dont l'id est = " + id)
    for (let index = 0; index < produits.length; index++) {
        const element = produits[index];
        if (element._id == id) {
            // console.log("************ trouvé");
            // afficheUnProduit(element);
            return index;
        }
    }
    return -1;
}

function remplirLeDom(produit) {
    // console.log("Coucou je rempli le dom");

    let insertion1 = document.getElementsByClassName("item__img");
    // console.log (insertion1[0]);
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
    // console.log("Nombre de couleurs = " + produit.colors.length);
    produit.colors.forEach(element => {
        // console.log(element);
        contenuDom += '<option value="' + element + '">' + element + '</option>\n';
    });

    // console.log(contenuDom);
    elementCible.innerHTML = contenuDom;
}


// Pour test >> a supprimer
function afficheUnProduit(produit) {
    console.log(produit.name);
    console.log(produit.description);
    console.log(produit.colors);
    console.log(produit.price);
    console.log(produit._id);
    console.log(produit.altTxt);
    console.log(produit.imageUrl);
}

// Pour test >> a supprimer
function afficheLesProduits(produits) {
    console.log("Longueur du tableau " + produits.length)
    for (let index = 0; index < produits.length; index++) {
        const element = produits[index];
        console.log("index = " + index)
        afficheUnProduit(element);
    }
}
