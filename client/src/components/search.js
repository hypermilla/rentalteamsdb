import _ from 'lodash';
import React from 'react';

function isMatch(term, entry) {
	const searchTerm = new RegExp(_.escapeRegExp(term, "i"), 'i');

	if (searchTerm.test(entry.toLowerCase())) {
		console.log("Match found!", searchTerm, entry);
		return true;
	}
	else return false; 
}

function search(data, term) {
	if (term.length > 0) {
		console.log("Search started!");

		if (!term.charAt(term.length - 1).match(/[a-z]/i)) {
			term = term.substring(0, term.length - 1);
		}

		let results = [];

		const resultsObj = _.filter(data, function(team) {
			for (const pkmn of team.pokemon) {
				if (isMatch(term, pkmn.name)) {
					results.push(pkmn.name);
					return true; 
				}
				if (isMatch(term, pkmn.ability)) {
					results.push(pkmn.ability);
					return true; 
				}
				if (isMatch(term, pkmn.item)) {
					results.push(pkmn.item);
					return true; 
				}
				for (const move of pkmn.moveset) {
					if (isMatch(term, move)) {
						results.push(move);
						return true; 
					}
				}
			}
		});

		return [results, resultsObj];
	}
	else {
		return [[], []];
	}
}

export default search; 