// Liste prédéfinie des noms de Pokémon de base pour le filtrage
const basePokemonList = ["bulbasaur", "charmander", "squirtle"];

function loadProducts(filterType = "all", filterEvolution = "all") {
    const productList = document.getElementById("product-list");
    productList.innerHTML = "";
    fetch("https://pokeapi.co/api/v2/pokemon?limit=25")
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

                        if (
                            productList ===
                            document.getElementById("product-list")
                        ) {
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
                        } else {
                            card.innerHTML = `
                                <img src="${
                                    pokemonDetails.sprites.front_default
                                }" alt="${pokemonDetails.name}">
                                <h3>${pokemonDetails.name}</h3>
                                <button class="add-to-cart" data-pokemon='${JSON.stringify(
                                    pokemonDetails
                                )}'>Acheter</button>
                            `;
                        }

                        productList.appendChild(card);
                    }
                });
            });
        })
        .catch((error) => console.error("Error:", error));
}

function generateRandomPrice() {
    return Math.floor(Math.random() * 100) + 1;
}

function showPopup(message) {
    alert(message);
}

document.addEventListener("DOMContentLoaded", function () {
    const cartItems = document.getElementById("cart-items");
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Panier vide.</p>";
    } else {
        cart.forEach((pokemon) => {
            if (
                pokemon &&
                pokemon.sprites &&
                pokemon.sprites.front_default &&
                pokemon.name &&
                pokemon.price !== undefined
            ) {
                const item = document.createElement("div");
                item.className = "cart-item";
                item.innerHTML = `
                    <h3>${pokemon.name}</h3>
                    <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
                    <p>Prix: ${pokemon.price} €</p>
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
            cartItems.innerHTML = "<p> Panier vide.</p>";
        });

    document
        .getElementById("return-to-shop")
        .addEventListener("click", function () {
            window.location.href = "index.html";
        });
});
