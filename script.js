const container = document.getElementById('pokedex-open');
let currentPokemonId = 1; // Start with Bulbarsaur. If it starts with 4, it will be Squirtutle.
let shiny = false;


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

        const sprite = shiny
            ? pokeData.sprites.other.showdown.front_shiny
            : pokeData.sprites.other.showdown.front_default;

        card.innerHTML = `
        <h4>No: ${pokeData.id}</h4>
        <p>${pokeData.types.map(t => t.type.name).join(', ')}</p>
        <img src="${sprite}" alt="${pokeData.name}">
        <div class="poke-name"><h3>${pokeData.name}${shiny ? ' ' : ''}</h3></div>
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
                let entries = speciesData.flavor_text_entries
                .filter(entry => entry.language.name ==="en")
                .map(entry => entry.flavor_text.replace(/\f/g, ' ').replace(/\n/g, ' '));

                entries = [...new Set(entries)]; // tar bort dubletter

                pokeInfo.innerHTML = `
                <h3>Pokémon information: </h3> 
                <p>${entries[0] || "no description available."} </p>
                `;

                const buttons = document.querySelectorAll('.blueSquare');
                buttons.forEach((button, index) => {
                    const text = entries[index] || "no description available.";
                    button.textContent = ` `;

                    button.addEventListener('click', () => {
                        pokeInfo.innerHTML =  `
                    <h3>Pokémon information: ${index + 1}</h3>
                    <p>${text}</p> 
                    `;
                });
            });
        })

            .catch(err => {
                pokeInfo.innerHTML = `<p>Error loading species info.</p>`;
            });
    };


// Buttons 

    function redBtn() {
        shiny = false; 
        fetchPokemon(currentPokemonId);
    }

    function blueBtn() {
        shiny = true;
        fetchPokemon(currentPokemonId);
    }

    function nextPokemon() {
        if (currentPokemonId < 151) {
            currentPokemonId++;
            shiny = false; 
            fetchPokemon(currentPokemonId);
        }
};

    function prevPokemon() {
        if (currentPokemonId > 1) {
            currentPokemonId--;
            shiny = false; 
            fetchPokemon(currentPokemonId);
        }
};

fetchPokemon(); // Calling the function(fetchPokemon())

document.querySelector('.blueBtn').addEventListener('click', blueBtn);
document.querySelector('.redBtn').addEventListener('click', redBtn);

