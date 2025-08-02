import { use, useEffect, useState } from "react"
import Search from "./components/Search"
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";

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
  const [isLoading, setIsLoading] = useState(false)

  const fetchMovies = async () => {

    setIsLoading(true);
    setErrorMessage('');

    try {
      const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
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

    } catch (error) {
      console.error(`Error fetching movies: ${error.message}`);
      setErrorMessage("Failed to fetch movies. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchMovies();
  }, [])

  return (
    <main>

      <div className="pattern">

        <div className="wrapper">
          <header>
            <img src="./hero.png" alt="Hero-Banner" />
            <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle</h1>

            <Search 
              searchTerm={searchTerm}
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
