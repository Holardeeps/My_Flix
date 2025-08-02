import { useEffect, useState } from 'react';
import { useDebounce } from 'react-use'
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import { updateSearchCount } from './appwrite';

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce prevents sending API calls for every letter the user types and waits for the user to stop typing after a specified time: in this case 500ms
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  const fetchMovies = async (query = '') => {

    setIsLoading(true);
    setErrorMessage('');

    try {
      // We declare the endpoint with a conditional literal so that when theres an available query passed by the user to be searched for we can run a URL and also when we are only getting from the API. the query is passed into the encodeURI() to convert the query from a string to a URI code
      const endpoint = query ? `${API_BASE_URL}/search/movie?query=$${encodeURIComponent(query)}` : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);

      if(!response.ok) {
        throw new Error('Failed to Fetch movies');
      }

      const data = await response.json();
      // console.log(data)

      if(Array.isArray(data.results) && data.results.length < 0) { //Array.isArray checks if the data returned is an Array should incase the API returns an object of another data type. it is used to safe check the data returned from the site to be able to control errors So we can perfrom Array methods oon the data returned.
        setErrorMessage(data.Error || 'Failed to fetch movies');
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);

      if(query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0])
      }

    } catch (error) {
      console.error(`Error fetching movies: ${error.message}`);
      setErrorMessage("Failed to fetch movies. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm])

  return (
    <main>

      <div className="pattern">

        <div className="wrapper">
          <header>
            <img src="./hero.png" alt="Hero-Banner" />
            <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle</h1>

            <Search 
              setDebouncedSearchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </header>

          <section className="all-movies">
            <h2 className="mt-[40px]">All Movies</h2>

            {isLoading ?  (
              <Spinner />
            ) : (
              errorMessage ? (
                <h2 className="text-red-500">{errorMessage}</h2>
              ) : (
                <ul>
                  {movieList.map((movie) => (
                    <MovieCard
                      key={movie.id}
                      movie = {movie}
                     />
                  ))}
                </ul>
              )
            )}
          </section>
        </div>
      </div>
    </main>
  )
}

export default App
