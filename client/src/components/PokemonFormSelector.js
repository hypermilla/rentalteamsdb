import React from 'react';

const PokemonFormSelector = (props) => {
	return (
		<div className='pkmn-form-selector'>
			<select value={props.selectedForm} onChange={(e) => props.onChange(e.target.value)}>
				{props.pkmnForms.map((form, i) =>
					<option key={i} value={form}>
						{form}
					</option>
				)}
			</select>
		</div>
	);

}

export default PokemonFormSelector; 