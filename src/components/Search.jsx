import React from "react";
//only keeping tracking of the search term itself not the movies to show
//Never mutate state directly - u only do it using the setState method
//Never mutate props from parent

const Search = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="search">
      <div>
        <img src="search.png" alt="search" />
        <input
          type="text"
          placeholder="Search through thousands of movies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Search;
