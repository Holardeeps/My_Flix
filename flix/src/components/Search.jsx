import React from 'react'

const Search = ({ searchTerm, setSearchTerm}) => {
  // Props should never be changed by the child component //We dont mutate the state, we only do so using the setterFunction
  return (
    <div className="search">
        <div>
            <img src="search.svg" alt="search" />

            <input 
                type="text"
                placeholder='Search through thousands of movies'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
             />
        </div>
    </div>
  )
}

export default Search
