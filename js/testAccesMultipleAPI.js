const listeProduits = "http://localhost:3000/api/products";
let panier = lireLocalStorage();
// console.log(panier);

for (let index = 0; index < panier.length; index++) {
    productId = panier[index].id;
    console.log(`L' id du produit à rechercher est : ${productId}`);
    const urlUnProduit = `${listeProduits}/${productId}`;
    console.log(`url de recherche = ${urlUnProduit}`);

    infoUnProduit = recupereLesInfos(urlUnProduit);
    console.log(`Le produit recherché est : ${infoUnProduit}`);
    
}

console.log("Je veux afficher ceci après les traitements fetch");

async function recupereLesInfos(urlUnProduit){
    await fetch(urlUnProduit)
    .then(function (res) {
        if (res.ok) {
            return res.json();
        }
    })
    .then(function (value) {
        return value;
    })
    .catch(function (err) {
        console.log(err);
    })
    ;
}

function lireLocalStorage() {
    return JSON.parse(localStorage.getItem("panierKanap"));
}
