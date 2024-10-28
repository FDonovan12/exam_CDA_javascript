fetch('produits.json')
    .then((response) => response.json())
    .then((data) => {
        fullProducts = data;
        showProducts(data);
    });

let fullProducts = [];
let productsDiv = [];
let shoppingCart = getShoppingCartLocal();
// resetShoppingCart();

const searchBar = document.querySelector('#search');
const priceMin = document.querySelector('#price-min');
const priceMax = document.querySelector('#price-max');
const shoppingDiv = document.querySelector('#shopping');
const shoppingIconDiv = document.querySelector('#shopping-icon');
const shoppingCartDiv = document.querySelector('#shopping-cart');
const body = document.querySelector('body');

searchBar.addEventListener('input', () => showProducts(filterProducts()));
priceMin.addEventListener('input', () => showProducts(filterProducts()));
priceMax.addEventListener('input', () => showProducts(filterProducts()));
shoppingIconDiv.addEventListener('click', (event) => openShopping(event));
body.addEventListener('click', (event) => {
    if (event.target.matches('body')) {
        closeAll();
    }
});

saveShoppingCart();

function filterProducts() {
    return fullProducts
        .map((product) => {
            return { product: product, substring: numberOfSubstringValid(searchBar.value, product.nom_produit) };
        })
        .filter((product) => product.substring > 0)
        .sort((product1, product2) => product2.substring - product1.substring)
        .map((product) => product.product)
        .filter(
            (product) =>
                parseFloat(product.prix) >= parseFloat(priceMin.value) &&
                parseFloat(product.prix) <= parseFloat(priceMax.value)
        );
}

function numberOfSubstringValid(search, name) {
    const listSearch = slugify(search).split('-');
    const slugifyName = slugify(name);
    const numberOfSubstringValid = listSearch
        .map((sea) => slugifyName.includes(sea))
        .map((bool) => (bool ? 1 : 0))
        .reduce((acc, sea) => acc + sea);
    return numberOfSubstringValid;
}

function slugify(str) {
    str = str.replace(/^\s+|\s+$/g, ''); // trim leading/trailing white space
    str = str.toLowerCase();
    str = str
        .replace(/[^a-z0-9 -]/g, '-') // replace any non-alphanumeric characters by hyphens
        .replace(/\s+/g, '-') // replace spaces with hyphens
        .replace(/-+/g, '-'); // remove consecutive hyphens
    return str;
}

function showProducts(products) {
    const parentDiv = document.querySelector('.products-grid');
    parentDiv.innerHTML = '';
    productsDiv = products.map((product) => showProduct(product, parentDiv));
    cardIsUnselected(parentDiv);
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
    card.addEventListener('click', (event) => {
        if (event.target.matches('button')) {
            return;
        }
        if (card.getAttribute('selected') === '') {
            cardIsUnselected(parentDiv, card);
        } else {
            cardIsSelected(parentDiv, card);
        }
    });
    card.appendChild(detail);
    parentDiv.appendChild(card);
    return card;
}

function cardIsSelected(parentDiv, card) {
    card.setAttribute('selected', '');
    card.querySelector('button').setAttribute('tabindex', 1);
    parentDiv.querySelectorAll('.card:not([selected])').forEach((card) => card.setAttribute('tabindex', -1));
}

function cardIsUnselected(parentDiv, card) {
    card?.removeAttribute('selected');
    card?.querySelector('button').setAttribute('tabindex', -1);
    parentDiv.querySelectorAll('.card').forEach((card) => card.setAttribute('tabindex', 1));
}

function addToShoppingCart(product) {
    const filterShop = shoppingCart.filter((shopProduct) => shopProduct.product.id === product.id);
    if (filterShop.length === 0) {
        shoppingCart.push({ product: product, number: 1 });
    } else {
        filterShop[0].number += 1;
    }
    saveShoppingCart();
}

function addContentToShoppingCart() {
    shoppingCartDiv.innerHTML = '';
    shoppingCart.forEach((product) => {
        div = createProductContentToShoppingCart(product);
        shoppingCartDiv.appendChild(div);
    });
    const total = document.createElement('div');
    shoppingCartDiv.appendChild(total);
}

function createProductContentToShoppingCart(product) {
    console.log('createProductContentToShoppingCart');
    const lineProduct = document.createElement('div');
    lineProduct.innerHTML = `
        <span class="name">${product.product.nom_produit} : </span><span class="number">${product.number}</span>
        <button name="plus" class="btn-primary fa-solid fa-plus" tabindex="-1"></button>
        <button name="minus" class="btn-primary fa-solid fa-minus" tabindex="-1"></button>
    `;

    const plus = lineProduct.querySelector('[name="plus"]');
    const minus = lineProduct.querySelector('[name="minus"]');

    plus.addEventListener('click', () => {
        product.number += 1;
        saveShoppingCart();
    });
    minus.addEventListener('click', () => {
        product.number <= 1 ? removeProductFromShoppingCart(product) : (product.number -= 1);
        saveShoppingCart();
    });
    return lineProduct;
}

function removeProductFromShoppingCart(product) {
    console.log(product);
    console.log(shoppingCart[0]);
    shoppingCart = shoppingCart.filter((productShop) => product.product.id != productShop.product.id);
    saveShoppingCart();
}

function openShopping(event) {
    if (event.target.matches('button')) {
        return;
    }
    shoppingDiv?.toggleAttribute('opened');
}

function saveShoppingCart() {
    localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));
    console.log(shoppingCart);
    addContentToShoppingCart();
}

function resetShoppingCart() {
    localStorage.setItem('shoppingCart', []);
    shoppingCart = getShoppingCartLocal();
}

function getShoppingCartLocal() {
    const local = localStorage.getItem('shoppingCart');
    return local ? JSON.parse(local) : [];
}

function closeAll() {
    productsDiv.map((productDiv) => cardIsUnselected(body, productDiv));
    shoppingDiv?.toggleAttribute('opened');
}
