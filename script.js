
const basePokemonList = ["bulbasaur", "charmander", "squirtle"];

function loadProducts(filterType = "all", filterEvolution = "all") {
    const productList = document.getElementById("product-list");
    productList.innerHTML = ""; 
    fetch("https://pokeapi.co/api/v2/pokemon?limit=25") 
        .then((response) => response.json())
        .then((data) => {
            const promises = data.results.map((pokemon) =>
                fetch(pokemon.url).then((res) => res.json())
            );
            Promise.all(promises).then((pokemonDetailsArray) => {
                pokemonDetailsArray.forEach((pokemonDetails) => {
                 
                    const isTypeMatch =
                        filterType === "all" ||
                        pokemonDetails.types.some(
                            (typeInfo) => typeInfo.type.name === filterType
                        );

                    const isEvolutionMatch =
                        filterEvolution === "all" ||
                        (filterEvolution === "base" &&
                            basePokemonList.includes(
                                pokemonDetails.name.toLowerCase()
                            ));

                    if (isTypeMatch && isEvolutionMatch) {
                        const card = document.createElement("div");
                        card.className = "card";

                        const randomPrice = generateRandomPrice();

                        card.innerHTML = `
                            <img src="${
                                pokemonDetails.sprites.front_default
                            }" alt="${pokemonDetails.name}">
                            <h3>${pokemonDetails.name}</h3>
                            <p>Prix: ${randomPrice} €</p> <!-- Ajoutez cette ligne pour afficher le prix -->
                            <button class="add-to-cart" data-pokemon='${JSON.stringify(
                                pokemonDetails
                            )}'>Acheter</button>
                        `;

                        productList.appendChild(card);
                    }
                });
            });
        })
        .catch((error) => console.error("Error:", error));
}

function generateRandomPrice() {
    return Math.floor(Math.random() * 50) + 1; 
}

function loadFilterOptions() {
    const typeSelect = document.getElementById("type-filter");
    fetch("https://pokeapi.co/api/v2/type")
        .then((response) => response.json())
        .then((data) => {
            data.results.forEach((type) => {
                const option = document.createElement("option");
                option.value = type.name;
                option.textContent = type.name;
                typeSelect.appendChild(option);
            });
        });
}

function applyFilters() {
    const selectedType = document.getElementById("type-filter").value;
    const selectedEvolution = document.getElementById("evolution-filter").value;
    loadProducts(selectedType, selectedEvolution); 
}

function setupEventListeners() {
    const productList = document.getElementById("product-list");
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    productList.addEventListener("click", function (event) {
        if (event.target && event.target.classList.contains("add-to-cart")) {
            const pokemon = JSON.parse(
                event.target.getAttribute("data-pokemon")
            );
            cart.push(pokemon);
            localStorage.setItem("cart", JSON.stringify(cart));

 const popup = document.createElement("div");
 popup.className = "popup";
 popup.textContent = "Article ajouté au panier";

 document.body.appendChild(popup);

 popup.classList.add("show");

 setTimeout(() => {
     popup.classList.remove("show");
     setTimeout(() => {
         popup.remove();
     }, 500);
 }, 2000);

            const cartItemCount = document.getElementById("cart-item-count");
            cartItemCount.textContent = cart.length.toString();
        }
    });

    document
        .getElementById("apply-filters")
        .addEventListener("click", applyFilters);
}

document.addEventListener("DOMContentLoaded", function () {
    loadProducts();
    loadFilterOptions();
    setupEventListeners();
});
document.addEventListener("DOMContentLoaded", function () {
    const cartItems = document.getElementById("cart-items");
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Votre panier est vide.</p>";
    } else {
        cart.forEach((pokemon) => {
            if (
                pokemon &&
                pokemon.sprites &&
                pokemon.sprites.front_default &&
                pokemon.name
            ) {
                const item = document.createElement("div");
                item.className = "cart-item";
                item.innerHTML = `
                    <h3>${pokemon.name}</h3>
                    <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
                `;
                cartItems.appendChild(item);
            } else {
                console.error(
                    "Donnée Pokémon invalide dans le panier:",
                    pokemon
                );
            }
        });
    }

    document
        .getElementById("clear-cart")
        .addEventListener("click", function () {
            localStorage.clear();
            cartItems.innerHTML = "<p>Votre panier est vide.</p>";
        });

    document
        .getElementById("back-to-shop")
        .addEventListener("click", function () {
            window.location.href = "index.html";
        });
});