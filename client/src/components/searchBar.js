import React from 'react';


const SearchBar = () => {
    return (
        <div className="search-bar">
            <input type="text" className="form-control" aria-label="Search for a pokémon, ability or move" aria-describedby="inputGroup-sizing-lg" />
        </div>
    );
}

export default SearchBar;