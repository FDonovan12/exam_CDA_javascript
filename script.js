fetch('produits.json')
    .then((response) => response.json())
    .then((data) => showProducts(data));

let productsDiv = [];

function showProducts(products) {
    const parentDiv = document.querySelector('.products-grid');
    parentDiv.innerHTML = '';
    productsDiv = products.map((product) => {
        const card = document.createElement('button');
        card.className = 'card';
        card.addEventListener('click', () => card.toggleAttribute('selected'));
        card.innerHTML += `
            <img src="${product.image}" alt="image de ${product.nom_produit}"></img>
            <div class="card-title">${product.nom_produit}</div>
            <div class="card-price">${product.prix}</div>
            <div class="details">
                <img src="${product.image}" alt="image de ${product.nom_produit}"></img>
                <div class="card-title">${product.nom_produit}</div>
                <div class="card-price">${product.prix}</div>
                <button class="card-price">${product.descriptif}</button>
            </div>
        `;
        parentDiv.appendChild(card);
    });
}

function name(params) {}
