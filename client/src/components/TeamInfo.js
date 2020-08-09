import React, { useState, useEffect } from 'react';
import PokemonInfo from './PokemonInfo';
import axios from 'axios';
import emptyTeamData from '../data/emptyTeamData.json';
import TeamInfoStatusChecker from './TeamInfoStatusChecker'; 

const TeamInfo = (props) => {
	const [team, setTeam] = useState(emptyTeamData); 
	const [hasFetchedTeam, setFetchedTeam] = useState(false); 

	function updatePkmnData(form, isShiny, index) {
		team.pokemon[index].form = form;
		team.pokemon[index].isShiny = isShiny;
		console.log('Updated Pkmn Data!', team.pokemon[index]);
		props.onUpdateTeamData(team);
	}

	function onFetchedTeamData(data) {
		console.log('TEAM FETCHED FROM ID:', data);
		setTeam(data); 
		setFetchedTeam(true);
	}

	let pokemon; 
	
	if (hasFetchedTeam) {
		pokemon = team.pokemon.map((poke, index) => 
			<PokemonInfo
				key={index}
				name={poke.name} 
				type1={poke.type1}
				type2={poke.type2}
				item={poke.item}
				ability={poke.ability}
				moveset={poke.moveset}
				isShiny={poke.isShiny}
				form={poke.form}
				isNewTeam={props.isNewTeam}
				updatePkmnData={(form, isShiny) => updatePkmnData(form, isShiny, index)}
			/>
		);
	}

	return (
		<div className="team">
			{ !hasFetchedTeam ?
				<TeamInfoStatusChecker 
					rentalCode={props.match.params.rentalCode} 
					onFetchedTeamData={(teamData) => onFetchedTeamData(teamData)}
				/> 

			:
				<div className="team-info card">
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
			}
		</div>
	);
}

export default TeamInfo;