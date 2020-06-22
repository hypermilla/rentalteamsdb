import React from 'react';
import PokemonInfo from './PokemonInfo';

//import teamData from '../data/teams.json';


const TeamDataPanel = (props) => {
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
		<div>
			<div className="team-data-panel">
				<div className="team-ign">
					IGN: {team.ign}
				</div>
				<div className="team-ign">
					Rental Code: {team.rentalCode}
				</div>
				<div className="team-pokemon">
					<ul>
						{pokemon}
					</ul>
				</div>
			</div>
		</div>
	);
}

export default TeamDataPanel;