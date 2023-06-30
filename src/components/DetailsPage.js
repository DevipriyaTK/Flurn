import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './SearchPage.css';
import './DetailsPage.css';
import './BookmarkPage.css';
import Chart from 'chart.js/auto';
import { useParams, useNavigate } from 'react-router-dom';
import pokeballSvg from '../pokeball.svg';

function DetailsPage({ handleClickList }) {
    const [loading, setLoading] = useState(true);
    const [pokemonData, setPokemonData] = useState(null);
    const [error, setError] = useState(null);
    const { pokemonID } = useParams();
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        axios
            .get(`https://pokeapi.co/api/v2/pokemon/${pokemonID}`)
            .then((response) => {
                setLoading(false);
                setPokemonData(response.data);
                setError(null);

                const favoritePokemon = localStorage.getItem('favoritePokemon');
                if (favoritePokemon) {
                    const parsedPokemon = JSON.parse(favoritePokemon);
                    console.log('Favorite', parsedPokemon);
                    const isPokemonBookmarked = parsedPokemon.find((pokemon) => pokemon.id === response.data.id);
                    if (isPokemonBookmarked) {
                        setIsBookmarked(true);
                    }
                }
            })
            .catch((error) => {

                setLoading(false);
                setPokemonData(null);
                setError(error.message);
            });
    }, [pokemonID]);

    const capitalizeFirstLetter = (name) => {
        return name.charAt(0).toUpperCase() + name.slice(1);
    };


    if (loading) {
        return (<div className="loading1">
            <img src={pokeballSvg} alt="Loading" className="rotating-image" />
        </div>);
    }

    if (error || !pokemonData) {
        return <div>Pokemon not found.</div>;
    }
    const HP = pokemonData.stats.find((stat) => stat.stat.name === "hp").base_stat;
    const Attack = pokemonData.stats.find((stat) => stat.stat.name === "attack").base_stat;
    const Defense = pokemonData.stats.find((stat) => stat.stat.name === "defense").base_stat;
    const SpecialAttack = pokemonData.stats.find((stat) => stat.stat.name === "special-attack").base_stat;
    const SpecialDefense = pokemonData.stats.find((stat) => stat.stat.name === "special-defense").base_stat;
    const Speed = pokemonData.stats.find((stat) => stat.stat.name === "speed").base_stat;
   

    const handleBookmarkClick = () => {
        setIsBookmarked(!isBookmarked);

        const favoritePokemon = localStorage.getItem('favoritePokemon');
        let bookmarkedPokemonArray = favoritePokemon ? JSON.parse(favoritePokemon) : [];

        if (!Array.isArray(bookmarkedPokemonArray)) {
            bookmarkedPokemonArray = [];
        }

        const isPokemonBookmarked = bookmarkedPokemonArray.find((pokemon) => pokemon.id === pokemonData.id);

        if (isPokemonBookmarked) {
            bookmarkedPokemonArray = bookmarkedPokemonArray.filter((pokemon) => pokemon.id !== pokemonData.id);
        } else {
            bookmarkedPokemonArray.push(pokemonData);
        }

        localStorage.setItem('favoritePokemon', JSON.stringify(bookmarkedPokemonArray));
        setShowAlert(true); // Show the alert

    };
    const handleLoadList = () => {
        handleClickList(); // Call the handleClickList function from props
        navigate('/bookmark'); // Navigate to the '/list' route
    };
    const handleListPage = () => {
        handleClickList(); // Call the handleClickList function from props
        navigate('/list'); // Navigate to the '/list' route
    };
    const handleAlertClose = () => {
        setShowAlert(false); // Hide the alert
    };

    return (
        <div className="container">
            <h1 className="heading">P<i></i>k&eacute;dex</h1>
            <div className="pokemon-details">
                <div className={`pokemon-card ${pokemonData?.types.find((type) => type.slot === 1)?.type.name === 'grass' ? 'green' :
                    pokemonData?.types.find((type) => type.slot === 1)?.type.name === 'fire' ? 'red' :
                        pokemonData?.types.find((type) => type.slot === 1)?.type.name === 'water' ? 'blue' :
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
                    <div className="bookmark-icon" onClick={handleBookmarkClick}>
                        {isBookmarked ? '\u2764\ufe0f' : '\u{1F5A4}'}
                    </div>
                    <h2 className="pokemon-name">{capitalizeFirstLetter(pokemonData.name)}</h2>
                    <img
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonData.id}.png`}
                        alt={pokemonData.name}
                        className="pokemonImage"
                    />
                </div>

                <div className="about">
                    <h2 className="h2">About</h2>
                    <table class="pokemon-table">
                        <tbody>
                            <tr>
                                <td><strong>Pokemon ID</strong></td>
                                <td>{pokemonData.id}</td>
                            </tr>
                            <tr>
                                <td><strong>Height</strong></td>
                                <td>{(pokemonData.height) * 10} cm</td>
                            </tr>
                            <tr>
                                <td><strong>Weight</strong></td>
                                <td>{(pokemonData.weight) / 10} kg</td>
                            </tr>
                            <tr>
                                <td><strong>Ability</strong></td>
                                <td>{capitalizeFirstLetter((pokemonData.abilities.map((ability) => ability.ability.name)).join(", "))}</td>
                            </tr>
                            <tr>
                                <td><strong>Species</strong></td>
                                <td>{capitalizeFirstLetter(pokemonData.types.map((type) => type.type.name).join(", "))}</td>
                            </tr>
                            
                        </tbody>

                    </table>

                </div>
                <StatsChart className="charts" stats={{ HP, Attack, Defense, SpecialAttack, SpecialDefense, Speed }} />



            </div>
            <div className="pokemon-grid1">
                <button onClick={handleLoadList} className="button">
                    Favourite Pokemons
                </button>
                <button onClick={handleListPage} className="button">
                    Explore more Pokemons
                </button>
            </div>
            <div className="alert">
                {showAlert && (
                    <CustomAlert
                        message={`${capitalizeFirstLetter(pokemonData.name)} has been ${isBookmarked ? 'added to favourite' : 'removed from favourite'}.`}
                        onClose={handleAlertClose}
                    />
                )}

            </div>
            
        </div>
    );
}

function CustomAlert({ message, onClose }) {
    return (
        <div className="custom-alert">
            <div className="custom-alert-content">
                <h2>{message}</h2>
                <button onClick={onClose}>OK</button>
            </div>
        </div>
    );
}
function StatsChart({ stats }) {
    const chartRef = useRef(null);

    useEffect(() => {
        const chartData = {
            labels: ['HP', 'Attack', 'Defense', 'Special Attack', 'Special Defense', 'Speed'],
            datasets: [
                {
                    data: [stats.HP, stats.Attack, stats.Defense, stats.SpecialAttack, stats.SpecialDefense, stats.Speed], backgroundColor: [
                        'rgba(255, 99, 132, 0.8)',
                        'rgba(54, 162, 235, 0.8)',
                        'rgba(255, 206, 86, 0.8)',
                        'rgba(75, 192, 192, 0.8)',
                        'rgba(153, 102, 255, 0.8)',
                        'rgba(255, 159, 64, 0.8)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                    ],
                    borderWidth: 1,
                },
            ],
        };


        const ctx = chartRef.current.getContext('2d');
        const chart = new Chart(ctx, {
            type: 'pie',
            data: chartData,
        });

        return () => {
            chart.destroy();
        };
    }, [stats]);

    return <canvas ref={chartRef} />;
}


export default DetailsPage;