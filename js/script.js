
const modal = document.querySelector("dialog");
const closeModal = document.querySelector(".modal-close");
const cardsPokemon = document.querySelector("#cards")

const form = document.querySelector(".form")
const input = document.querySelector(".search-bar")

let ULR = "https://pokeapi.co/api/v2/pokemon/";

const coresTipos = {
    grass: "#E8F5E9",
    fire: "#FBE9E7",
    water: "#E3F2FD",
    electric: "#FFF9C4",
    psychic: "#FCE4EC",
    ground: "#EFEBE9",
    ice: "#E0F7FA",
    dark: "#EDE7F6",
    normal: "#F0F0E8",
    fighting: "#F5DAD5",
    flying: "#E8EAF6",
    poison: "#F3E5F5",
    bug: "#F0F4C3",
    rock: "#EDE7D6",
    ghost: "#E8DFF5",
    dragon: "#E1DDF7",
    steel: "#ECEFF1",
    fairy: "#FCE4F2"
};



for (let i = 1; i <= 151; i++) {
    fetch(ULR + i)
        .then((response) => response.json())
        .then(data => mostrarPokemon(data))
}




/////////////// função que cria a div dos cards dos pokémons dinamicamente ///////////////

function mostrarPokemon(poke) {
    const tipoPrincipal = poke.types[0].type.name;
    const cor = coresTipos[tipoPrincipal] ?? "#F7F7FA";

    let pokeId = poke.id.toString();
    if (pokeId.length === 1) {
        pokeId = "00" + pokeId;
    } else if (pokeId.length === 2) {
        pokeId = "0" + pokeId;
    }

    const div = document.createElement("div");
    div.classList.add("cards");
    div.innerHTML = `
            <button class="pokemon-card" type="button" data-id="1" style="background-color: ${cor};">
                <span class="pokemon-number">#${pokeId}</span>

                <img class="img-card" src="${poke.sprites.other.home.front_default}" alt="${poke.name}">
                <img class="alt-img" src="${poke.sprites.other.showdown.front_default}" alt="${poke.name}">

                <h3 class="capitalize">${poke.name}</h3>

                <div class="pokemon-types">
                    ${poke.types.map(item => {
                    const tipo = item.type.name;
                    const corTipo = coresTipos[tipo] ?? "#F7F7FA";
                    const tipoId = item.type.url.split("/").filter(Boolean).pop();
                    const icone = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/small/${tipoId}.png`;

                    return `
                            <span
                                class="pokemon-type capitalize"
                                style="background-color: ${corTipo};"
                                
                            >
                                <img src="${icone}" alt="" class="type-icon">
                                ${tipo}
                            </span>
                        `;
                    }).join("")}
                </div>
            </button>
        `;
    cardsPokemon.append(div)
}




form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const pesquisa = input.value.trim().toLowerCase();

    if (!pesquisa) return;

    try {
        const response = await fetch(ULR + encodeURIComponent(pesquisa));

        if (response.status === 404) {
            alert("Pokémon não encontrado.");
            return;
        }

        if (!response.ok) {
            throw new Error("Erro ao buscar Pokémon.");
        }

        const pokemon = await response.json();

        cardsPokemon.replaceChildren();
        mostrarPokemon(pokemon);
    } catch (erro) {
        console.error(erro);
        alert("Não foi possível pesquisar. Tente novamente.");
    }
    input.value = '';
});



/////////////////////////////////Abre e fecha o modal/////////////////////////////
cardsPokemon.addEventListener("click", function (event) {
    const card = event.target.closest(".pokemon-card");

    if (!card) return;

    modal.showModal();
});


closeModal.onclick = function () {
    modal.close();
};