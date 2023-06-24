import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import pokeballSvg from '../pokeball.svg';
import './SearchPage.css';
import './DetailsPage.css';

function SearchPage({ handleClickList }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [pokemonData, setPokemonData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    setLoading(true);
    axios
      .get(`https://pokeapi.co/api/v2/pokemon/${searchTerm}`)
      .then((response) => {
        setLoading(false);
        setPokemonData(response.data);
        setError(null);
      })
      .catch((error) => {
        setLoading(false);
        setPokemonData(null);
        setError(error.message);
      });
  };

  const handleLoadList = () => {
    handleClickList(); // Call the handleClickList function from props
    navigate('/list'); // Navigate to the '/list' route
  };

  useEffect(() => {
    document.title = 'Pokedex';
  }, []);

  const capitalizeFirstLetter = (name) => {
        return name.charAt(0).toUpperCase() + name.slice(1);
    };
   
  return (
    <div className="container">
          <h1 className="heading">P<i></i>k&eacute;dex</h1>
          <div className="input-container">
              <input
                  className="input"
                  type="text"
                  value={searchTerm}
                  onChange={handleInputChange}
                  placeholder="Enter a Pokemon name..."
              />
              <button onClick={handleSearch} className="button">
                  Search
              </button>
          </div>
      
      <button onClick={handleLoadList} className="button">
        List of Pokemons
      </button>
          {loading ? (
              <div className="loading">
                  <img src={pokeballSvg} alt="Loading" className="rotating-image" />
              </div>
          ) : (
              <>
          {error && <div><h4>Incorrect Name</h4></div>}
                      {pokemonData && (
                          <div className={`pokemon-card ${pokemonData?.types.find((type) => type.slot === 1)?.type.name === 'grass' ? 'green' :
                              pokemonData?.types.find((type) => type.slot === 1)?.type.name === 'fire' ? 'red' :
                              pokemonData?.types.find((type) => type.slot === 1)?.type.name === 'water' ? 'blue':
                              pokemonData?.types.find((type) => type.slot === 1)?.type.name === 'bug' ? 'olive' :
                              pokemonData?.types.find((type) => type.slot === 1)?.type.name === 'normal' ? 'lavender' :
                              pokemonData?.types.find((type) => type.slot === 1)?.type.name === 'poison' ? 'violet' :
                              pokemonData?.types.find((type) => type.slot === 1)?.type.name === 'electric' ? 'yellow' :
                              pokemonData?.types.find((type) => type.slot === 1)?.type.name === 'ground' ? 'brown' :
                              pokemonData?.types.find((type) => type.slot === 1)?.type.name === 'fairy' ? 'pink' :
                              pokemonData?.types.find((type) => type.slot === 1)?.type.name === 'fighting' ? 'lightBrown' :
                              pokemonData?.types.find((type) => type.slot === 1)?.type.name === 'psychic' ? 'lightViolet' :
                              pokemonData?.types.find((type) => type.slot === 1)?.type.name === 'rock' ? 'grey' :
                              pokemonData?.types.find((type) => type.slot === 1)?.type.name === 'ice' ? 'skyBlue' :
                              pokemonData?.types.find((type) => type.slot === 1)?.type.name === 'dragon' ? 'darkYellow' :
                              ''}`}>
                              <h2 className="pokemon-name">{capitalizeFirstLetter(pokemonData.name)}</h2>
                              <img
                                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonData.id}.png`}
                                  alt={pokemonData.name}
                                  className="pokemon-image"
                              />
                             
                          </div>

                      )}
        </>
      )}
    </div>
  );
}

export default SearchPage;
