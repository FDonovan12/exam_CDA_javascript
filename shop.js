let shoppingCart = getShoppingCartLocal();

const shoppingForm = document.querySelector('#shopping-form');
const shoppingDiv = document.querySelector('#shopping');
const shoppingIconDiv = document.querySelector('#shopping-icon');
const shoppingCartDiv = document.querySelector('#shopping-cart');

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

shoppingIconDiv.addEventListener('click', (event) => openShopping(event));

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
