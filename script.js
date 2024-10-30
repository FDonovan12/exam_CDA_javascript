fetch('produits.json')
    .then((response) => response.json())
    .then((data) => {
        fullProducts = data;
        showProducts(randomItem(6));
    });

let fullProducts = [];
let productsDiv = [];

const searchForm = document.querySelector('#search-form');
const searchBar = document.querySelector('#search');
const priceMin = document.querySelector('#price-min');
const priceMax = document.querySelector('#price-max');
const body = document.querySelector('body');
const indexLink = document.querySelector('#index');
const allProductsLink = document.querySelector('#all-products');
const blueTheme = document.querySelector('#blue');
const redTheme = document.querySelector('#red');
const greenTheme = document.querySelector('#green');
saveShoppingCart();
console.log('test');
saveThemeUser([blueTheme, redTheme, greenTheme]);
getThemeUser();

indexLink.addEventListener('click', () => {
    searchForm.style.display = 'none';
    showProducts(randomItem(6));
});
allProductsLink.addEventListener('click', () => {
    searchForm.style.display = 'grid';
    showProducts(filterProducts());
});
searchBar.addEventListener('input', () => showProducts(filterProducts()));
priceMin.addEventListener('input', () => showProducts(filterProducts()));
priceMax.addEventListener('input', () => showProducts(filterProducts()));
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

function closeAll() {
    productsDiv.map((productDiv) => cardIsUnselected(body, productDiv));
    shoppingDiv?.removeAttribute('opened');
}

function saveThemeUser(allThemesRadio) {
    console.log(allThemesRadio);
    allThemesRadio.forEach((theme) => {
        theme.addEventListener('input', () => {
            localStorage.setItem('themeUser', theme.id);
        });
    });
}

function getThemeUser() {
    const theme = localStorage.getItem('themeUser');
    if (theme) {
        document.getElementById(theme).click();
    }
}
