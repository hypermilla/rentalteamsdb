import React, { useRef } from 'react';
import PokemonInfo from './PokemonInfo';
import PropTypes from 'prop-types';

const TeamInfo = (props) => {

	const linkTextRef = useRef(null); 

	function updatePkmnData(form, isShiny, index) {
		team.pokemon[index].form = form;
		team.pokemon[index].isShiny = isShiny;
		console.log('Updated Pkmn Data!', team.pokemon[index]);
		props.onUpdateTeamData(team);
	}

	function copyLinkToClipboard(e) {
		linkTextRef.current.select(); 
		document.execCommand("copy");
		//linkTextRef.setSelectionRage(0, 99999); 
	}

	let team = props.teamData; 
	let teamURL = window.location.hostname + '/' + team.rentalCode.replace(/\b0+/g, '');
	let pokemon = team.pokemon.map((poke, index) => 
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


	return (
		<div className="team-info card">
			<div className="card-header">
				Your Team Info: 
			</div>
			<div className="card-body">
				<h4>IGN: <span className="team-ign">{team.ign}</span></h4>
				<h4>Rental Code: <span className="team-code">{team.rentalCode}</span></h4>
				<div class="team-link input-group mb-3">
					<input type="text" class="form-control" id="teamLink" ref={linkTextRef} value={teamURL} />
					<div class="input-group-append">
						<button class="btn btn-primary copy-link-btn" id="basic-addon2" onClick={(e) => copyLinkToClipboard(e)}>
							Copy Link
						</button>
					</div>
				</div>
			</div>
			<div className="team-pokemon card-deck">
				{pokemon}
			</div>
		</div>
	);
}

TeamInfo.propTypes = {
	teamData: PropTypes.any.isRequired
}

export default TeamInfo;