import React, {useState, useEffect } from 'react';
import SearchBar from './searchBar';
import TeamInfo from './TeamInfo';
import Header from './Header';
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
			try {
				let result = await axios.get(`/api/fetch_teams`); 
				setData(result.data.teams);
				console.log('Fetched', result.data.teams.length, 'teams');
				console.log(result); 
			}
			catch (error) {
				console.log('Could not fetch data:', error);
				setTimeout(fetchTeams, 5000);
			}

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
        <div className="landing container">
			<Header />
			<h3>Pokémon Rental Teams Repository</h3>
			<p>Search for competitive teams to try out, or <Link to="/newteam" className="text-link">add your own</Link>.</p>

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