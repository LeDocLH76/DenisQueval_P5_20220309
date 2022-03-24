// Recuperer le panier du locaStorage.
panier = JSON.parse(localStorage.getItem("panierKanap"));
console.table(panier);
console.log(typeof panier + panier);

// Si panier n'existe pas ou vide => info utilisateur et retour à l'acceuil.
// Si ok créer un tableau d'Id des articles presents dans le panier.
if (panier == null | panier == "") {
    alert("Le panier est vide. Retour à l'acceuil");
    location.replace("index.html");
};
 
    let products = [];
    panier.forEach(element => {
        console.log(element);
        products.push(element.id);
        console.table(products);
    });

// Recupere l'objet contact dans le localStorage
contact = JSON.parse(localStorage.getItem("contact"));
console.table(contact);
console.log(typeof contact + contact);
// Si contact n'existe pas ou l'une des cles est vide => info utilisateur et retour au panier.
if (contact == null) {
    alert("Le formulaire de contact n'existe pas.");
    location.replace("cart.html");
} else {
    for (const key in contact) {
        if (contact[key] == "") {
            alert("Le formulaire est mal rempli");
            location.replace("cart.html");
        }
    }
};

// Prepare le Json du contact + panierId.
let contactJson = JSON.stringify(contact);
console.log(contactJson);
let productsJson = JSON.stringify(products);
console.log(productsJson);
let content = '{"contact": ' + contactJson + ',"products": ' + productsJson + '}';
console.log(typeof content + content);

// Envoyer le post et recuperer le retour.
commander(content);

// Afficher le numero de confirm.
// Effacer panier et contact du LS.
// Info utilisateur numero volatile, email envoyé et retour à l'acceuil.

// 




// Passer la commande
function commander(content) {
    const commandeUrl = "http://localhost:3000/api/products/order";
    fetch(commandeUrl, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        method: 'post',
        body: content
    })
        .then(function (res) {
            if (res.ok) {
                console.log("Reponse = " + res);
                return res.json();

            }
        })
        .then(function (value) {
            console.table(value);
            console.log(value.orderId);
            cible = document.getElementById("orderId");
            cible.innerHTML = value.orderId;
            alert("Votre commande est enregistrée.\nCe numéro ne sera plus affiché.\nUn email vous à été envoyé à " + value.contact.email + " pour confirmer.");
            location.replace("index.html");
        })
        .catch(function (err) {
            console.log("Probleme " + err);
        })
        ;
}
