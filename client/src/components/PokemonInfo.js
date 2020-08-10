import React, { useState, useEffect }from 'react';
import PokemonFormSelector from './PokemonFormSelector'; 
import PokemonShinySelector from './PokemonShinySelector'; 
import pkmnData from '../data/pokemon.json';

const PokemonInfo = (props) => {
	const [form, setForm] = useState(props.form);
	const [isShiny, setIsShiny] = useState(props.isShiny); 
	const [sprite, setSprite] = useState(getSpriteFileName(props.name.toLowerCase(), props.form));

	const pkmnName = props.name.toLowerCase();
	const pkmnAvailableForms = getPkmnForms(pkmnName);

	useEffect(() => {
		setSprite(getSpriteFileName(props.name.toLowerCase(), form));
	});

	function getPokemonTypeClass(pokemonType) {
		if (pokemonType == undefined) {
			return "badge badge-primary ";
		}
		let pokemonTypeClass = "badge badge-primary " + pokemonType.toLowerCase();
		return pokemonTypeClass;
	}

	function getPkmnForms(pkmnName) {
		for (const pkmn of pkmnData) {
			const currentPkmnName = new RegExp(pkmn.name, "i");
			const selectedPkmn = currentPkmnName.test(pkmnName); 
			if (selectedPkmn && pkmn.forms.length > 0) {
				if (pkmn.forms[0] != 'None')
					pkmn.forms.splice(0, 0, 'None');
				return pkmn.forms; 
			}
		}
		return null; 
	}

	function getSpriteFileName(pkmn, form) {
		let pkmnColor = 'normal'; 
		if (isShiny)
			pkmnColor = 'shiny'; 

		const baseURL = 'https://raphgg.github.io/den-bot/data/sprites/pokemon/' + pkmnColor + '/';
		const extension = '.gif'; 

		switch (pkmn) {
			case 'mr. mime':
			case 'mime jr.':
			case 'mr. rime': 
				pkmn = pkmn.replace('.', '').split(' ').join('-');
				break;
			default: 
				pkmn = pkmn.replace('-', '');
		}

		form = form.toLowerCase();
		switch (form) {
			case "alolan": 
			case "crowned": 
			case "dusk": 
			case "midnight": 
			case "galarian": 
			case "mega": 
			case "megay":
			case "megax": 
			case "primal":
			case "ultra":
				return baseURL + form + '-' + pkmn + extension;
			case "":
				return baseURL + pkmn + extension;
			case "dusk-form":
				return baseURL + "dusk-" + pkmn + extension;
			case "galarian-zen":
				return baseURL + "galarian-" + pkmn + "-zen" + extension; 
			case 'none':
				return baseURL + pkmn + extension; 
			default:
				//ignore
		}
		return baseURL + pkmn + '-' + form + extension; 
	}

	function updatePkmnForm(newForm) {
		setForm(newForm); 
		props.updatePkmnData(newForm, isShiny); 
	}

	function updateShiny(checked) {
		console.log('is shiny:', checked);
		setIsShiny(checked);
		props.updatePkmnData(form, checked);
	}

	const moveset = props.moveset.map((move, i) =>
		<li key={i}>
			Move {i+1}: {move}
		</li>
	);

	return (
		<div className="pokemon-info card bg-dark shadow">
			<div className="card-img-top">
				<img className="pokemon-sprite" src={sprite} />
			</div>
			<div className="card-body">
				<h5 className="pokemon-name card-title">{props.name}</h5>
				<div className="pokemon-type">
					<span className={getPokemonTypeClass(props.type1)}>
						{props.type1}
					</span> &nbsp;
					<span className={getPokemonTypeClass(props.type2)}>
						{props.type2}
					</span>
				</div>
				<ul className="list-group list-group-flush bg-dark">
					{ props.isNewTeam ? 
						<li className="pokemon-options list-group-item bg-dark">
							<PokemonShinySelector 
								onChange={(checked) => updateShiny(checked)} 
								checked={isShiny} 
							/>
							{ pkmnAvailableForms ? 
								<PokemonFormSelector 
									pkmnForms={pkmnAvailableForms} 
									onChange={(form) => updatePkmnForm(form)}
									selectedForm={form}
								/>
							: null }
						</li> 
					: null }
					<li className="pokemon-item list-group-item bg-dark">
						Item: {props.item}
					</li>
					<li className="pokemon-ability list-group-item bg-dark">
						Ability: {props.ability}
					</li>
					<li className="pokemon-moveset list-group-item bg-dark">
					<ul>
						{moveset}
					</ul>
				</li>

				</ul>
			</div>
		</div>
	);

}

export default PokemonInfo; 