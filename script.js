fetch('produits.json')
    .then((response) => response.json())
    .then((data) => {
        fullProducts = data;
        showProducts(data);
    });

let fullProducts = [];
let productsDiv = [];
let shoppingCart = [];

const searchBar = document.querySelector('#search');
const priceMin = document.querySelector('#price-min');
const priceMax = document.querySelector('#price-max');
const shoppingCartDiv = document.querySelector('#shopping-cart');
// const priceRange = document.querySelector('#price-range');

function filterProducts() {
    return fullProducts
        .filter((product) => searchIsvallid(searchBar.value, product.nom_produit))
        .filter(
            (product) =>
                parseFloat(product.prix) >= parseFloat(priceMin.value) &&
                parseFloat(product.prix) <= parseFloat(priceMax.value)
        );
}

function searchIsvallid(search, name) {
    const listSearch = slugify(search).split('-');
    const containSubstrig = listSearch
        .map((sea) => slugify(name).includes(slugify(sea)))
        .reduce((acc, sea) => acc + sea);
    return containSubstrig;
}
function slugify(str) {
    str = str.replace(/^\s+|\s+$/g, ''); // trim leading/trailing white space
    str = str.toLowerCase(); // convert string to lowercase
    str = str
        .replace(/[^a-z0-9 -]/g, '') // remove any non-alphanumeric characters
        .replace(/\s+/g, '-') // replace spaces with hyphens
        .replace(/-+/g, '-'); // remove consecutive hyphens
    return str;
}

searchBar.addEventListener('input', () => showProducts(filterProducts()));
priceMin.addEventListener('input', () => showProducts(filterProducts()));
priceMax.addEventListener('input', () => showProducts(filterProducts()));

function showProducts(products) {
    console.log('showProducts');
    const parentDiv = document.querySelector('.products-grid');
    parentDiv.innerHTML = '';
    productsDiv = products.map((product) => showProduct(product, parentDiv));
    cardIsUnselected(parentDiv);
    console.log(productsDiv);
    console.log(products);
}

function showProduct(product, parentDiv) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
            <img src="${product.image}" alt="image de ${product.nom_produit}"></img>
            <div class="card-title">${product.nom_produit}</div>
            <div class="card-price">${product.prix}</div>
        `;

    const detail = document.createElement('div');
    detail.className = 'details';
    detail.innerHTML = `
        <div class="grid-container">
            <img class="full-width" src="${product.image}" alt="image de ${product.nom_produit}"></img>
            <div class="detail-title"><span>${product.nom_produit}</span><span>${product.prix}</span></div>
            <div class="detail-description">${product.descriptif}</div>
            <ul class="detail-attribut full-width grid-container">
                <li class="full-width grid-container"><span>Résolution : </span><span>${product.caracteristiques.résolution}</span></li>
                <li class="full-width grid-container"><span>zoom : </span><span>${product.caracteristiques.zoom}</span></li>
                <li class="full-width grid-container"><span>connectivité : </span><span>${product.caracteristiques.connectivité}</span></li>
                <li class="full-width grid-container"><span>écran : </span><span>${product.caracteristiques.écran}</span></li>
            </ul>
            <button tabindex="-1" class="btn-primary">Acheter</button>
        </div>
        `;

    detail.querySelector('button').addEventListener('click', () => addToShoppingCart(product));
    card.addEventListener('click', () => {
        console.log(card);
        console.log(card.getAttribute('selected'));
        if (card.getAttribute('selected') == '') {
            cardIsUnselected(parentDiv, card);
        } else {
            cardIsSelected(parentDiv, card);
        }
    });
    card.appendChild(detail);
    parentDiv.appendChild(card);
    return card;
}

function addToShoppingCart(product) {
    shoppingCart.push(product);
    shoppingCartDiv.innerHTML = shoppingCart.map((product) => product.nom_produit);
}

function cardIsSelected(parentDiv, card) {
    card.toggleAttribute('selected');
    card.querySelector('button').setAttribute('tabindex', 0);
    parentDiv.querySelectorAll('.card:not([selected])').forEach((card) => card.setAttribute('tabindex', -1));
}

function cardIsUnselected(parentDiv, card) {
    card?.toggleAttribute('selected');
    card?.querySelector('button').setAttribute('tabindex', -1);
    parentDiv.querySelectorAll('.card').forEach((card) => card.setAttribute('tabindex', 1));
}
