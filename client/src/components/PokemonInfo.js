import React from 'react';

const PokemonInfo = (props) => {

	const pokemonName = props.name.toLowerCase();
	let pkmnSprite = `https://raphgg.github.io/den-bot/data/sprites/pokemon/normal/${pokemonName}.gif`;

	const moveset = props.moveset.map((move, i) =>
		<li key={i}>
			Move {i+1}: {move}
		</li>
	);

	function getPokemonTypeClass(pokemonType) {
		if (pokemonType == undefined) {
			return "badge badge-primary ";
		}
		let pokemonTypeClass = "badge badge-primary " + pokemonType.toLowerCase();
		return pokemonTypeClass;
	}

	return (
		<div className="pokemon-info card bg-dark shadow">
			<div className="card-img-top">
				<img className="pokemon-sprite" src={pkmnSprite} />
			</div>
			<div class="card-body">
				<h5 className="pokemon-name card-title">{props.name}</h5>
				<div className="pokemon-type">
					<span className={getPokemonTypeClass(props.type1)}>
						{props.type1}
					</span> &nbsp;
					<span className={getPokemonTypeClass(props.type2)}>
						{props.type2}
					</span>
				</div>
				<ul class="list-group list-group-flush bg-dark">
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