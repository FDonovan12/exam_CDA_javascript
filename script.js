fetch('produits.json')
    .then((response) => response.json())
    .then((data) => {
        fullProducts = data;
        showProducts(randomItem(6));
    });

let fullProducts = [];
let productsDiv = [];
let shoppingCart = getShoppingCartLocal();
// resetShoppingCart();

const searchForm = document.querySelector('#search-form');
const shoppingForm = document.querySelector('#shopping-form');
const searchBar = document.querySelector('#search');
const priceMin = document.querySelector('#price-min');
const priceMax = document.querySelector('#price-max');
const shoppingDiv = document.querySelector('#shopping');
const shoppingIconDiv = document.querySelector('#shopping-icon');
const shoppingCartDiv = document.querySelector('#shopping-cart');
const body = document.querySelector('body');
const indexLink = document.querySelector('#index');
const allProductsLink = document.querySelector('#all-products');

shoppingForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const lastName = shoppingForm.querySelector('#last-name').value;
    const firstName = shoppingForm.querySelector('#first-name').value;
    const address = shoppingForm.querySelector('#address').value;
    const bankCard = shoppingForm.querySelector('#bank-card').value;
    const lastNameIsValid = lastName.length >= 2;
    const firstNameIsValid = firstName.length >= 2;
    const addressIsValid = address.length >= 2;
    const bankCardIsValid = bankCard.length === 16;
    const formIsValid = lastNameIsValid && firstNameIsValid && addressIsValid && bankCardIsValid;
    if (formIsValid) {
        alert('la commande a bien etait validée');
        closeAll();
        resetShoppingCart();
    }
});
indexLink.addEventListener('click', () => {
    searchForm.style.display = 'none';
    showProducts(randomItem(6));
});
allProductsLink.addEventListener('click', () => {
    searchForm.style.display = 'block';
    showProducts(filterProducts());
});
searchBar.addEventListener('input', () => showProducts(filterProducts()));
priceMin.addEventListener('input', () => showProducts(filterProducts()));
priceMax.addEventListener('input', () => showProducts(filterProducts()));
shoppingIconDiv.addEventListener('click', (event) => openShopping(event));
body.addEventListener('click', (event) => {
    if (event.target.matches('body')) {
        closeAll();
    }
});

function randomItem(number) {
    let shuffled = fullProducts
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
    return shuffled.slice(0, number);
}
saveShoppingCart();

function filterProducts() {
    return fullProducts
        .map((product) => {
            return { product: product, nbSubstring: numberOfSubstringValid(searchBar.value, product.nom_produit) };
        })
        .filter((product) => product.nbSubstring > 0)
        .sort((product1, product2) => product2.nbSubstring - product1.nbSubstring)
        .map((product) => product.product)
        .filter((product) => parseFloat(product.prix) <= parseFloat(priceMax.value))
        .filter((product) => parseFloat(product.prix) >= parseFloat(priceMin.value));
}

function numberOfSubstringValid(search, name) {
    const words = slugify(search).split('-');
    const slugifyName = slugify(name);
    const numberOfSubstringValid = words
        .map((word, index) => (slugifyName.includes(word) ? (words.length - index) / words.length + 1 : 0))
        .reduce((acc, wordInName) => acc + wordInName);
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
    total.className = 'total-price';
    total.innerHTML = `
        <span>Total : </span><span>${
            Math.round(
                shoppingCart
                    .map((productCart) => parseFloat(productCart.product.prix) * productCart.number)
                    .reduce((acc, priceProduct) => acc + priceProduct, 0) * 100
            ) / 100
        }€</span>    
    `;
    shoppingCartDiv.appendChild(total);
    shoppingIconDiv.setAttribute('nb-cart', shoppingCart.length);
}

function createProductContentToShoppingCart(productCart) {
    const lineProduct = document.createElement('div');
    lineProduct.className = 'product-cart';
    lineProduct.innerHTML = `
        <span class="name">${productCart.product.nom_produit} : </span><span class="number">${productCart.number}</span>
        <button name="plus" class="btn-primary fa-solid fa-plus" tabindex="-1"></button>
        <button name="minus" class="btn-primary fa-solid fa-minus" tabindex="-1"></button>
    `;

    const plus = lineProduct.querySelector('[name="plus"]');
    const minus = lineProduct.querySelector('[name="minus"]');

    plus.addEventListener('click', () => {
        productCart.number += 1;
        saveShoppingCart();
    });
    minus.addEventListener('click', () => {
        productCart.number <= 1 ? removeProductFromShoppingCart(productCart) : (productCart.number -= 1);
        saveShoppingCart();
    });
    return lineProduct;
}

function removeProductFromShoppingCart(productCart) {
    shoppingCart = shoppingCart.filter((productShop) => productCart.product.id != productShop.product.id);
}

function openShopping(event) {
    if (event.target.matches('button')) {
        return;
    }
    shoppingDiv?.toggleAttribute('opened');
}

function saveShoppingCart() {
    localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));
    addContentToShoppingCart();
}

function resetShoppingCart() {
    shoppingCart = [];
    saveShoppingCart();
}

function getShoppingCartLocal() {
    const local = localStorage.getItem('shoppingCart');
    return local ? JSON.parse(local) : [];
}

function closeAll() {
    productsDiv.map((productDiv) => cardIsUnselected(body, productDiv));
    shoppingDiv?.removeAttribute('opened');
}
