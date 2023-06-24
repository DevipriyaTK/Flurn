import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './SearchPage.css';
import DetailsPage from './DetailsPage';
import pokeballSvg from '../pokeball.svg';


function ListingPage({ handleClickList }) {
    const [loading, setLoading] = useState(false);
    const [nextPage, setNextPage] = useState(null);
    const [pokemonData, setPokemonData] = useState([]);
    const [selectedPokemon, setSelectedPokemon] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        loadPokemonData('https://pokeapi.co/api/v2/pokemon?limit=10');
    }, []);

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
    }, [nextPage]);

    const loadPokemonData = async (url) => {
        setLoading(true);
        try {
            const response = await axios.get(url);
            setLoading(false);
            setNextPage(response.data.next);

            const uniqueNames = new Set();
            const combinedData = [...pokemonData, ...response.data.results];
            const filteredData = combinedData.filter((pokemon) => {
                if (uniqueNames.has(pokemon.name)) {
                    return false;
                }
                uniqueNames.add(pokemon.name);
                return true;
            });

            const updatedData = await Promise.all(
                filteredData.map(async (pokemon) => {
                    const pokemonResponse = await axios.get(pokemon.url);
                    const types = pokemonResponse.data.types.map((typeData) => typeData.type.name);
                    return {
                        name: pokemon.name,
                        url: pokemon.url,
                        types: types,
                    };
                })
            );

            setPokemonData(updatedData);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };

    const loadMorePokemon = () => {
        if (nextPage) {
            loadPokemonData(nextPage);
        }
    };

    const capitalizeFirstLetter = (name) => {
        return name.charAt(0).toUpperCase() + name.slice(1);
    };
    const handleLoadList = () => {
        handleClickList(); // Call the handleClickList function from props
        navigate('/search'); // Navigate to the '/list' route
    };

    return (
        <div className="container">
            <h1 className="heading">P<i></i>k&eacute;dex</h1>
            <button onClick={handleLoadList} className="button">
                Search Pokemons
            </button>
            <div className="pokemon-grid">
                {pokemonData.map((pokemon) => (
                    <Link to={`/details/${pokemon.url.split('/')[6]}`} className="pokemon-link">
                    <div
                        className={`pokemon-card ${pokemon.types[0] === 'grass' ? 'green' :
                            pokemon.types[0] === 'fire' ? 'red' :
                                pokemon.types[0] === 'water' ? 'blue' :
                                    pokemon.types[0] === 'bug' ? 'olive' :
                                        pokemon.types[0] === 'normal' ? 'lavender' :
                                            pokemon.types[0] === 'poison' ? 'violet' :
                                                pokemon.types[0] === 'electric' ? 'yellow' :
                                                    pokemon.types[0] === 'ground' ? 'brown' :
                                                        pokemon.types[0] === 'fairy' ? 'pink' :
                                                            pokemon.types[0] === 'fighting' ? 'lightBrown' :
                                                                pokemon.types[0] === 'psychic' ? 'lightViolet' :
                                                                    pokemon.types[0] === 'rock' ? 'grey' :
                                                                        pokemon.types[0] === 'ice' ? 'skyBlue' :
                                                                            pokemon.types[0] === 'dragon' ? 'darkYellow' :
                                                                                // Add more cases for other types
                                                                                ''}`}
                    >

                            <img
                                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.url.split('/')[6]}.png`}
                                alt={pokemon.name}
                                className="pokemon-image"
                            />
                            <p className="pokemon-name" style={{ textDecoration: 'none' }}>{capitalizeFirstLetter(pokemon.name)}</p>

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