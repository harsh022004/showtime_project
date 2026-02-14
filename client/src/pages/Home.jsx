import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getPopularMovies, searchMovies } from "../api";
import MovieCard from "../components/MovieCard";

const Home = () => {
  const [movies, setMovies] = useState([]);
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("search");

  useEffect(() => {
  const fetchData = async () => {
    try {
      let allMovies = [];

      if (searchQuery) {
        const page1 = await searchMovies(searchQuery, 1);
        const page2 = await searchMovies(searchQuery, 2);
        const page3 = await searchMovies(searchQuery, 3);

        allMovies = [
          ...page1.data.results,
          ...page2.data.results,
          ...page3.data.results,
        ];
      } else {
        const page1 = await getPopularMovies(1);
        const page2 = await getPopularMovies(2);
        const page3 = await getPopularMovies(3);

        allMovies = [
          ...page1.data.results,
          ...page2.data.results,
          ...page3.data.results,
        ];
      }

      setMovies(allMovies);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  fetchData();
}, [searchQuery]);

  return (
    <div className="page">
      <h2>
        {searchQuery
          ? `Search Results for "${searchQuery}"`
          : "Popular Movies"}
      </h2>

      <div className="movie-grid">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default Home;