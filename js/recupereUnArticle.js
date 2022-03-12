let pageCourante = window.location.href;
let url = new URL(pageCourante);
console.log("url = " + url);
let productId = url.searchParams.get("id");
console.log("Numéro du produit = " + productId);
const listeProduits = "http://localhost:3000/api/products";
const urlUnProduit = listeProduits + "/" + productId;
console.log(urlUnProduit)

fetch(urlUnProduit)
.then(function (res){
    if (res.ok) {
        return res.json();
    }
})
.then(function (value){
    remplirLeDom(value);
})
.catch(function (err){
    console.log(err);
});

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

