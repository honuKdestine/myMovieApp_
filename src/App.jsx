import React, { useEffect } from "react";
import Search from "./components/Search";
import { useState } from "react";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import { useDebounce } from "react-use";
import { getTrendingMovies, updateSearchCount } from "./appwrite";
//API - Application Programming Interface - a set of rules that allows one software system to interact with another ( a database or server somewhere else)

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(""); // to be passed as prop to search
  const [searchTerm, setSearchTerm] = useState(""); //to be passed as prop to search

  const [movieList, setMovieList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [trendingMovies, setTrendingMovies] = useState([]);
  // const [trendingErrorMessage, setTrendingErrorMessage] = useState("")
  // const [trendingLoading, setTrendingLoading] = useState(false);

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 800, [searchTerm]); //debounce the search term by 500ms

  //when you're fetching something, typically it's a good practice to open up
  // a try-catch block

  const fetchMovies = async (query = "") => {
    setIsLoading(true); //before anything loads, right at the start, we set isLoading to true
    setErrorMessage(""); //set the error message to nothing because it doesn't exist yet

    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&include_adult=false`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&`; //this is the endpoint we're going to fetch
      const response = await fetch(endpoint, API_OPTIONS); // fetch is a function that makes a request to the server

      if (!response.ok) {
        // if the response is not okay, we're going to throw an error
        throw new Error("Failed to fetch movies"); // this is the error message that will be displayed
      }

      const data = await response.json(); // this is the data that we're going to get from the API

      if (data.Response == "False") {
        // if the response is false, we're going to display an error message
        setErrorMessage(data.Error || "Failed to fetch movies"); // this is the error message that will be displayed
        setMovieList([]); // we're going to set the movie list to nothing
        return; // we're going to return out of the function
      }

      setMovieList(data.results || []); // we're going to set the movie list to the data we got from the API
      // updateSearchCount(); // we're going to update the search count right after we fetch the movies

      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      // if there's an error, we're going to display an error message
      console.error(`Error fetching movies: ${error}`);

      setErrorMessage("Error fetching movies. Please try again later"); // this is the error message that will be displayed
    } finally {
      // this is the code that will run regardless of whether there's an error or not
      setIsLoading(false); //finally after everything else, no matter what happens, we stopLoading
      //because if it succeeds, we show the movies, if it fails, we show the error message
    }
  };

  const loadTrendingMovies = async () => {
    try {

      const movies = await getTrendingMovies();

      setTrendingMovies(movies);

    } catch (error) {
      console.log(`Error fetching trending movies: ${error}`);
      // setErrorMessage('Error fetching trending movies'); //doing this will break the entire app functionality so we won't
    }
  };

  useEffect(() => {
    //onLoad, we call the fetchMovies function
    fetchMovies(debouncedSearchTerm); // we're going to pass the debounced search term to the fetchMovies function so that it fetches the movies based on the search term
  }, [debouncedSearchTerm]); // we're going to pass the search term as a dependency so whenever it changes , we fetch the movies again

  useEffect(() => {
    // onLoad, we call the loadTrendingMovies function
    loadTrendingMovies();
  }, []); // with an empty dependency array, this will only run once, when the component mounts, i.e only get called at the start


  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy
            Without The Hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>


        {trendingMovies.length > 0 && (
          <section className="trending">
          <h2>Trending Movies</h2>

          <ul>
            {trendingMovies.map((movie, index) => (
              <li key={movie.$id}>
                <p>{index + 1}</p>
                <img src={movie.poster_url} alt={movie.title} />
              </li>
            ))}
          </ul>

          </section>
        )

        }

        <section className="all-movies">
          <h2>All Movies</h2>

          {isLoading ? (
            <Spinner /> //render the spinning wheel if isLoading is true
          ) : errorMessage ? ( //else if there's an error message, render it
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            //else if no error occurs then render the movieList
            <ul>
              {movieList.map(
                (
                  movie // map through the movieList and render each movie
                ) => (
                  <MovieCard key={movie.id} movie={movie} />
                )
              )}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;

{
  /* <p key={movie.id} className="text-white">{movie.title}</p> */
}
{
  /* {errorMessage ? <p className="text-red-500">{errorMessage}</p> : null} */
}
