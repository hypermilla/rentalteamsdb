import React from 'react'; 

const PokemonShinySelector = (props) => {
	return (
		<div className='pkmn-form-selector'>
			<input 
				type='checkbox' 
				onChange={(e) => 
				props.onChange(e.target.checked)} 
				name='Shiny' 
				checked={props.checked}
			/>&nbsp; 
			<label htmlFor="Shiny">Shiny</label>
		</div>
	);

}

export default PokemonShinySelector; 