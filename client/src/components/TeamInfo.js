import React from 'react';
import PokemonInfo from './PokemonInfo';

import teamData from '../data/teams.json';


const TeamInfo = (props) => {
	if (!props.teamData) {
		return null;
	}

	//const data = JSON.parse(teamData);
	//const team = teamData[0];
	const team = props.teamData;

	console.log(team);
	const pokemon = team.pokemon.map((poke) => 
		<PokemonInfo
				name={poke.name} 
				type1={poke.type1}
				type2={poke.type2}
				item={poke.item}
				ability={poke.ability}
				moveset={poke.moveset}
		/>
	);

	return (
		<div class="team-info card">
				<div className="card-header">
					Your Team Info: 
				</div>
				<div className="card-body">
					<h4>IGN: <span className="team-ign">{team.ign}</span></h4>
					<h4>Rental Code: <span className="team-code">{team.rentalCode}</span></h4>
				</div>
				<div className="team-pokemon card-deck">
						{pokemon}
				</div>
		</div>
	);
}

export default TeamInfo;