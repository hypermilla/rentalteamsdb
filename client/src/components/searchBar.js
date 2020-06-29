import React, { useState, useEffect } from 'react';
import SearchGrid from './searchGrid';


const SearchBar = (props) => {

	const [value, setValue] = useState('Search for a Pokémon, Ability or Move');
	const [isResultsActive, setResultsActive] = useState(false);

	useEffect(() => {
		if (props.results[0].length > 0) {
			setResultsActive(true);
		}
	}, [setResultsActive]);

	const onInputChange = (newValue) => {
		setValue(newValue);
		if (newValue.length < 1)
			setResultsActive(false);
		else if (newValue.length > 2) {
			props.onTermChange(newValue);
			setResultsActive(true);
		}
	}

	const onEnterFocus = () => {
		setValue("");
		setResultsActive(false);
	}

	const onLeaveFocus = () => {
		setValue("");
		setResultsActive(false);
	}

	const onResultSelect = (result) => {
		console.log("Result selected!");
		props.onResultSelect(result);
	}

	const onSearchSubmit = () => {
		console.log(value);
	}

    return (
        <div className="search-bar">
			<input 
				type="text" 
				value={value}
				onChange={event => onInputChange(event.target.value)}
				onFocus={event => onEnterFocus()}
				onBlur={event => onLeaveFocus()}
			/>

			{ isResultsActive ?
				<SearchGrid
					isActive={isResultsActive}
					results={props.results}
					onResultSelect={(result) => onResultSelect(result)}
				/>
			: null }
        </div>
	);
}

export default SearchBar;