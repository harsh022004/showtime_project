import axios from "axios";

const API_KEY = import.meta.env.VITE_TMDB_KEY;
const BASE_URL = "https://api.themoviedb.org/3";


export const getPopularMovies = (page = 1) =>
  axios.get(`${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`);

export const searchMovies = (query, page = 1) =>
  axios.get(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}&page=${page}`
  );

export const getMovieDetails = (id) =>
  axios.get(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`);

