const container = document.getElementById('pokedex-open');
let currentPokemonId = 1; // Start with Bulbarsaur. If it starts with 4, it will be Squirtutle.



function fetchPokemon(id = currentPokemonId) {
    fetch (`https://pokeapi.co/api/v2/pokemon/${id}/`) //* ${id} takes the ID number of the pokemon.
        .then(response => response.json()) // Once the request succeds, we take the raw response and make it to JSON.
        .then(function(pokeData) { // After converting to JSON, the function(allpokemon) will look more clean in JSON
            displayPokemon(pokeData);
            console.log(pokeData);
        })
        .catch(err => console.error("Error fetching Pokémon data :", err)) // Shows up to tell you where went wrong (if the code breaks)
    };

// Main Pokémon info
    function displayPokemon(pokeData) {
        const card = document.querySelector('.pokemon-card');
        const pokeName = document.querySelector('.poke-name');

        card.innerHTML = `
        <h4>No: ${pokeData.id}</h4>
        <p>${pokeData.types.map(t => t.type.name).join(', ')}</p>
        <img src="${pokeData.sprites.other.showdown.front_default}" alt="${pokeData.name}">
        <div class="poke-name"><h3>${pokeData.name}</h3></div>
        `;
        
// Pokemon Attacks
        const moves = document.querySelector('.pokemon-moves');
        moves.innerHTML = `
        <ul>Attack: ${pokeData.moves.slice(0,4).map(a =>`<li>${a.move.name}</li>`).join('')}</ul> 

        `;
// Pokemon information
        const pokeInfo = document.querySelector('.poke-info');
        fetch(pokeData.species.url)
            .then(response => response.json())
            .then(speciesData => {
                const entry = speciesData.flavor_text_entries.find(entry => entry.language.name ==="en")?.flavor_text || "no description available.";

                pokeInfo.innerHTML = `
                <h3>Pokémon information:</h3> <p>${entry}</p>
                `;
            })

            .catch(err => {
                pokeInfo.innerHTML = `<p>Error loading species info.</p>`;
            });
    };


// Buttons 

    function nextPokemon() {
        if (currentPokemonId < 151) {
            currentPokemonId++;
            fetchPokemon(currentPokemonId);
        }
};

    function prevPokemon() {
        if (currentPokemonId > 1) {
            currentPokemonId--;
            fetchPokemon(currentPokemonId);
        }
};

fetchPokemon(); // Calling the function(fetchPokemon())

