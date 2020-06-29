import React from 'react';

const SearchGrid = (props) => {

	const matches = props.results[0];
	const teamResults = props.results[1]; 
	console.log("Grid results", teamResults);

	const getTeamText = (pokemon) => {
		let teamPokemonText = ""; 
		for (const pkmn of pokemon) {
			if (pokemon[pokemon.length -1] == pkmn) {
				teamPokemonText += pkmn.name;
			}
			else teamPokemonText += pkmn.name + " | ";
		}
		console.log(teamPokemonText);
		return teamPokemonText;
	}

	const resultsList = teamResults.map((result, i) => (
		<li
		  key={i}
		  id={i}
		  className="grid-result"
		  onMouseDown={() => props.onResultSelect(result)}
		>	
			<span className="match badge badge-light">match: {matches[i]}</span>
			<span className="ign badge badge-light">by IGN: {result.ign}</span> 
			<p className="pokemon">{getTeamText(result.pokemon)}</p>
		</li>
	));

	return (
		<div className="search-grid">
			<ul className="list-group">{resultsList}</ul>
		</div>
	);

}

export default SearchGrid;