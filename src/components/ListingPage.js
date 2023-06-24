import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './SearchPage.css';
import './DetailsPage.css';
import DetailsPage from './DetailsPage';
import pokeballSvg from '../pokeball.svg';

function ListingPage({ handleClickList }) {
  const [loading, setLoading] = useState(false);
  const [nextPage, setNextPage] = useState(null);
  const [pokemonData, setPokemonData] = useState([]);
  const [selectedPokemon] = useState(null);
  const [primaryTypes, setPrimaryTypes] = useState({});
  const navigate = useNavigate();

  const loadPokemonData = useCallback((url) => {
  setLoading(true);
  axios
    .get(url)
    .then((response) => {
      const combinedData = [...pokemonData, ...response.data.results];
      const uniqueNames = new Set();
      const fetchPokemonTypes = combinedData.map((pokemon) =>
        axios.get(pokemon.url)
      );

      axios
        .all(fetchPokemonTypes)
        .then((responses) => {
          setLoading(false);
          setNextPage(response.data.next);

          const filteredData = combinedData.filter((pokemon, index) => {
            if (uniqueNames.has(pokemon.name)) {
              return false;
            }

            const types = responses[index].data.types;
            const primaryType = types[0].type.name;
            const color = getPokemonColor(primaryType);

            setPrimaryTypes((prevTypes) => ({
              ...prevTypes,
              [pokemon.name]: color,
            }));

            uniqueNames.add(pokemon.name);
            return true;
          });

          setPokemonData(filteredData);
        })
        .catch((error) => {
          setLoading(false);
          console.log('Failed to fetch Pokemon types', error);
        });
    })
    .catch((error) => {
      setLoading(false);
      console.log('Failed to fetch Pokemon data', error);
    });
}, [pokemonData]);


  const loadMorePokemon = useCallback(() => {
    if (nextPage) {
      loadPokemonData(nextPage);
    }
  }, [nextPage, loadPokemonData]);

  useEffect(() => {
    loadPokemonData('https://pokeapi.co/api/v2/pokemon?limit=500');
  }, [loadPokemonData]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const documentHeight = document.documentElement.offsetHeight;

      if (scrollPosition === documentHeight) {
        loadMorePokemon();
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loadMorePokemon]);

  const capitalizeFirstLetter = (name) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const handleLoadList = () => {
    handleClickList();
    navigate('/search');
  };

  const getPokemonColor = (type) => {
    switch (type) {
      case 'grass':
        return 'green';
      case 'fire':
        return 'red';
      case 'water':
        return 'blue';
      case 'bug':
        return 'olive';
      case 'normal':
        return 'lavender';
      case 'poison':
        return 'violet';
      case 'electric':
        return 'yellow';
      case 'ground':
        return 'brown';
      case 'fairy':
        return 'pink';
      case 'fighting':
        return 'lightBrown';
      case 'psychic':
        return 'lightViolet';
      case 'rock':
        return 'grey';
      case 'ice':
        return 'skyBlue';
      case 'dragon':
        return 'darkYellow';
      case 'ghost':
          return 'violet';
      default:
        return 'black';
    }
  };

  return (
    <div className="container">
      <h1 className="heading">P<i></i>k&eacute;dex</h1>
      <button onClick={handleLoadList} className="button">
        Search Pokemons
      </button>
      <div className="pokemon-grid">
        {pokemonData.map((pokemon) => (
          <Link to={`/details/${pokemon.url.split('/')[6]}`} key={pokemon.name} className="pokemon-link">
            <div className={`pokemon-card ${primaryTypes[pokemon.name] || ''}`}>
              <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.url.split('/')[6]}.png`}
                alt={pokemon.name}
                className="pokemon-image"
              />
              <p className="pokemon-name" style={{ textDecoration: 'none' }}>
                {capitalizeFirstLetter(pokemon.name)}
              </p>
            </div>
          </Link>
        ))}
      </div>
      {loading ? (
        <div>
          <img src={pokeballSvg} alt="Loading" className="rotating-image" />
        </div>
      ) : (
        <>
          {selectedPokemon && <DetailsPage pokemonId={selectedPokemon} />}
        </>
      )}
    </div>
  );
}

export default ListingPage;
