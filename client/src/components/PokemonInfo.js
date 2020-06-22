import React from 'react';

const PokemonInfo = (props) => {

	const pokemonName = props.name.toLowerCase();
	let pkmnSprite = `https://raphgg.github.io/den-bot/data/sprites/pokemon/normal/${pokemonName}.gif`;

	const moveset = props.moveset.map((move, i) =>
		<li key={i}>
			{move}
		</li>
	);

	return (
		<div className="pokemon-info">
			<div className="pokemon-sprite">
				<img src={pkmnSprite} />
			</div>
			<div className="pokemon-name">{props.name}</div>
			<div className="pokemon-type">{props.type1} {props.type2}</div>
			<div className="pokemon-item">{props.item}</div>
			<div className="pokemon-ability">{props.ability}</div>
			<div className="pokemon-moveset">
				<ul>
					{moveset}
				</ul>
			</div>
		</div>
	);

}

export default PokemonInfo; 