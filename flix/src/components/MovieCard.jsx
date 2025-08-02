import React from 'react'

const MovieCard = ({ movie: 
    { title, vote_average, poster_path, release_date, original_language }
     }) => {
  return (
    <div className='movie-card'>
      <img 
        src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : '/no-movie png'} 
        alt={title}
       />

       <div className="mt-4">
        <h3>{title}</h3>

        <div className="content">
            <div className="rating">
                <img 
                    src="star.svg" 
                    alt="Star Icon"
                 />
                 {/* The .toFixed() rounds the number to a set of decimal place and returns it as a string. it rounds the number not cut off and returns the result as a string */}
                <p>{vote_average ? vote_average.toFixed(1) : 'N/A'}</p> 
                
            </div>

            <span>•</span>
            <p className="lang">{original_language}</p>
            <span>•</span>
            {/* The .split() it splits the string into parts using a defined seperator like '-' or ',' or ':' */}
            <p className="year">{release_date ? release_date.split('-')[0] : 'N/A'}</p>
        </div>
       </div>
    </div>
  )
}


export default MovieCard
