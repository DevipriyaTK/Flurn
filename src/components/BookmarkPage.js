import { useNavigate } from 'react-router-dom';
import './SearchPage.css';
import React, { useEffect, useState } from 'react';

function BookmarkPage({ handleClickList }) {
  const [favoritePokemon, setFavoritePokemon] = useState([]);
    const navigate = useNavigate();


  useEffect(() => {
    const storedPokemon = localStorage.getItem('favoritePokemon');
    if (storedPokemon) {
      const parsedPokemon = JSON.parse(storedPokemon);
      setFavoritePokemon(parsedPokemon);
    }
    document.title = 'Pokedex - Favorite Pokemon';
  }, []);

  const handlePokemonClick = (pokemonID) => {
    navigate(`/details/${pokemonID}`);
    };
    const handleBookmarkClick = (pokemonID,pokemonName) => {
        const updatedFavoritePokemon = favoritePokemon.filter((pokemon) => pokemon.id !== pokemonID);
        setFavoritePokemon(updatedFavoritePokemon);
        localStorage.setItem('favoritePokemon', JSON.stringify(updatedFavoritePokemon));
        window.alert(`${capitalizeFirstLetter(pokemonName)} has been removed from favorites.`);
    };
    const capitalizeFirstLetter = (name) => {
        return name.charAt(0).toUpperCase() + name.slice(1);
    };
    const handleListPage = () => {
        handleClickList(); // Call the handleClickList function from props
        navigate('/list'); // Navigate to the '/list' route
    };
  return (
      <div className="container">
          <h1 className="heading">P<i></i>k&eacute;dex</h1>
          <div className="pokemon-grid">
              {favoritePokemon.length === 0 ? (
                  <p>No favorite Pok�mon yet.</p>
              ) : (
                      favoritePokemon.map((pokemon) => (

                          <div key={pokemon.id} className={`pokemon-card ${pokemon?.types.find((type) => type.slot === 1)?.type.name === 'grass' ? 'green' :
                              pokemon?.types.find((type) => type.slot === 1)?.type.name === 'fire' ? 'red' :
                              pokemon?.types.find((type) => type.slot === 1)?.type.name === 'water' ? 'blue':
                              pokemon?.types.find((type) => type.slot === 1)?.type.name === 'bug' ? 'olive' :
                              pokemon?.types.find((type) => type.slot === 1)?.type.name === 'normal' ? 'lavender' :
                              pokemon?.types.find((type) => type.slot === 1)?.type.name === 'poison' ? 'violet' :
                              pokemon?.types.find((type) => type.slot === 1)?.type.name === 'electric' ? 'yellow' :
                              pokemon?.types.find((type) => type.slot === 1)?.type.name === 'ground' ? 'brown' :
                              pokemon?.types.find((type) => type.slot === 1)?.type.name === 'fairy' ? 'pink' :
                              pokemon?.types.find((type) => type.slot === 1)?.type.name === 'fighting' ? 'lightBrown' :
                              pokemon?.types.find((type) => type.slot === 1)?.type.name === 'psychic' ? 'lightViolet' :
                              pokemon?.types.find((type) => type.slot === 1)?.type.name === 'rock' ? 'grey' :
                              pokemon?.types.find((type) => type.slot === 1)?.type.name === 'ice' ? 'skyBlue' :
                              pokemon?.types.find((type) => type.slot === 1)?.type.name === 'dragon' ? 'darkYellow' :
                              ''}`}>
                              <div
                                  className="bookmark-icon"
                                  onClick={() => handleBookmarkClick(pokemon.id,pokemon.name)}
                              >
                                  {'\u2764\ufe0f'}
                              </div>            
              <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
                alt={pokemon.name}
                                  className="pokemon-image"
                                  onClick={() => handlePokemonClick(pokemon.id)} 
              />
                              <p className="pokemon-name">{capitalizeFirstLetter(pokemon.name)}</p>
            </div>
          ))
        )}
          </div>
          <button onClick={handleListPage} className="button">
              Explore more Pokemons
          </button>
    </div>
  );
}

export default BookmarkPage;