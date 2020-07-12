import React, {useState, useEffect } from 'react';
import SearchBar from './searchBar';
import TeamInfo from './TeamInfo';
import { Link } from 'react-router-dom';

import _ from 'lodash';
import axios from 'axios';
import search from './search';

const LandingPage = () => {

	const [data, setData] = useState(''); 
	const [results, setResults] = useState([[], []]);
	const [teamData, setTeamData] = useState('');

	useEffect(() => {
		const fetchTeams = async () => {
			let result = await axios.get('/api/fetch_teams'); 
			setData(result.data.teams);
		};

		fetchTeams();
	}, [setData]);



	const delayedSearch = _.debounce(term => {
		const searchResults = search(data, term);  
		setResults(searchResults);
		console.log("Total Search Results:", searchResults);
	}, 200); 

	const searchTerm =  async (term) => {
		if (term.length > 2)
			delayedSearch(term);
	};

	const handleSelectTeam = (selectedTeamData) => {
		setTeamData(selectedTeamData); 
		console.log("Updated Selected Team Data", selectedTeamData);
	}


    return (
        <div className="landing">
			<h3>Pokémon Sword & Shield Rental Teams Repository</h3>
			<p>Search for competitive Pokémon teams to try out, or add your own.</p>

			<SearchBar 
				onTermChange={searchTerm}
				results={results}
				onResultSelect={handleSelectTeam}
			/>

			<br></br>

			{ teamData ?
				<TeamInfo
					teamData={teamData}
				/>
			: null }
        </div>
    );
}

export default LandingPage;