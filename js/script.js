const modal = document.querySelector("dialog");
const closeModal = document.querySelector(".modal-close");
const cardsPokemon = document.querySelector("#cards")
const todosPokemons = [];
let tipoSelecionado = "all";
let exibindoPesquisa = false;

const form = document.querySelector(".form")
const input = document.querySelector(".search-bar")

const shinyButton = document.querySelector(".shiny-toggle");

let URL = "https://pokeapi.co/api/v2/pokemon/";

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
    fetch(URL + i)
        .then((response) => response.json())
        .then(poke => {
            todosPokemons.push(poke)
            if (!exibindoPesquisa && correspondeAoTipo(poke)) mostrarPokemon(poke);
        })
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
            <button class="pokemon-card" type="button" data-id="${poke.id}" style="background-color: ${cor};">
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





///barra de pesquisa
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const pesquisa = input.value.trim().toLowerCase();

    if (!pesquisa) return;

    try {
        const response = await fetch(URL + encodeURIComponent(pesquisa));

        if (response.status === 404) {
            alert("Pokémon not found.");
            return;
        }

        if (!response.ok) {
            throw new Error("Failed to fetch Pokémon.");
        }

        const pokemon = await response.json();

        exibindoPesquisa = true;
        cardsPokemon.replaceChildren();
        mostrarPokemon(pokemon);
    } catch (erro) {
        console.error(erro);
        alert("Unable to search. Please try again.");
    }
    input.value = '';
});











////preeche o modal com os dados dinâmicos
async function preencherModal(poke) {
    modal.querySelector(".pokemon-number").textContent = `#${String(poke.id).padStart(3, "0")}`;

    modal.querySelector(".modal-poke-name").textContent = poke.name;

    // const imagem = modal.querySelector(".modal-img");
    // imagem.src = poke.sprites.other.home.front_default;

    const resposta = await fetch(poke.species.url);

    if (!resposta.ok) {
        throw new Error("Failed to fetch description.");
    }

    const especie = await resposta.json();

    const descricao = especie.flavor_text_entries.find(
        item => item.language.name === "en"
    );




    /////descrição
    modal.querySelector(".modal-description").textContent =
        descricao
            ? descricao.flavor_text.replace(/\s+/g, " ").trim()
            : "Description unavailable.";

    const medidas = modal.querySelectorAll(".modal-measurement strong")

    medidas[0].textContent =
        `${(poke.height / 10).toLocaleString("en-US")} m`;

    medidas[1].textContent =
        `${(poke.weight / 10).toLocaleString("en-US")} kg`;


    /////habilidades
    modal.querySelector(".modal-abilities p").textContent =
        poke.abilities.map(item => item.ability.name).join(" • ");






    ///////estatísticas
    const statsModal = [
        { nome: "hp", numero: ".hp-number", barra: ".stat-hp" },
        { nome: "attack", numero: ".atk-number", barra: ".stat-attack" },
        { nome: "defense", numero: ".def-number", barra: ".stat-defense" },
        { nome: "speed", numero: ".vel-number", barra: ".stat-speed" }
    ];

    statsModal.forEach(stat => {
        const dado = poke.stats.find(item => item.stat.name === stat.nome);
        const valor = dado.base_stat;

        modal.querySelector(stat.numero).textContent = valor;


        //calcula o tamanho da barra e atribui a porcentagem ao width
        const porcentagem = Math.min((valor / 255) * 100, 100);
        modal.querySelector(stat.barra).style.width = `${porcentagem}%`;
    });




    //tipos
    modal.querySelector(".pokemon-types").innerHTML = poke.types.map(item => {
        const tipo = item.type.name;
        const cor = coresTipos[tipo] ?? "#F7F7FA";

        return `
            <span class="pokemon-type capitalize"
                  style="background-color: ${cor};">
                ${tipo}
            </span>
        `;
    }).join("");







    const imagem = modal.querySelector(".modal-img");
    const imagemNormal = poke.sprites.other.home.front_default;
    const imagemShiny = poke.sprites.other.home.front_shiny;

    let mostrandoShiny = false;

    imagem.src = imagemNormal;
    imagem.alt = poke.name;

    shinyButton.textContent = "Show shiny";
    shinyButton.setAttribute("aria-pressed", "false");
    shinyButton.disabled = !imagemShiny;

    shinyButton.onclick = function () {
        mostrandoShiny = !mostrandoShiny;

        imagem.src = mostrandoShiny ? imagemShiny : imagemNormal;
        imagem.alt = mostrandoShiny ? `${poke.name} shiny` : poke.name;

        shinyButton.textContent = mostrandoShiny
            ? "Show normal"
            : "Show shiny";

        shinyButton.setAttribute("aria-pressed", String(mostrandoShiny));
    };
}







///////evento de click no card para abrir o modal
cardsPokemon.addEventListener("click", async function (event) {
    const card = event.target.closest(".pokemon-card");

    if (!card) return;

    const id = card.dataset.id;

    try {

        const response = await fetch(URL + id);

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const pokemon = await response.json();

        await preencherModal(pokemon);
        modal.showModal();
    } catch (erro) {
        console.error("Error opening dialog:", erro);
        alert(erro.message);
    }
});


//////fecha o modal
closeModal.onclick = function () {
    modal.close();
};



///////filtro
const filtros = document.querySelector(".filters-center");
const seletorTipo = document.querySelector("#type-filter");
const limparFiltros = document.querySelector(".clear-filters");

filtros.querySelectorAll("[data-type]").forEach(filtro => {
    if (filtro.dataset.type === "all") return;
    const option = document.createElement("option");
    option.value = filtro.dataset.type;
    option.textContent = filtro.querySelector("p").textContent;
    seletorTipo.append(option);
});

function correspondeAoTipo(poke) {
    return tipoSelecionado === "all" ||
        poke.types.some(item => item.type.name === tipoSelecionado);
}

function aplicarFiltro(tipo) {
    tipoSelecionado = tipo;
    exibindoPesquisa = false;
    seletorTipo.value = tipo;

    filtros.querySelectorAll("[data-type]").forEach(filtro => {
        filtro.classList.toggle("filters-active", filtro.dataset.type === tipo);
    });

    cardsPokemon.replaceChildren();
    todosPokemons.filter(correspondeAoTipo).forEach(mostrarPokemon);
}

filtros.addEventListener("click", function (event) {
    const filtro = event.target.closest("[data-type]");
    if (!filtro) return;
    aplicarFiltro(filtro.dataset.type);
});

seletorTipo.addEventListener("change", function () {
    aplicarFiltro(seletorTipo.value);
});

limparFiltros.addEventListener("click", function () {
    input.value = "";
    aplicarFiltro("all");
});