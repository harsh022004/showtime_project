import { useNavigate } from "react-router-dom";

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const image = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

  return (
    <div className="movie-card" onClick={() => navigate(`/movie/${movie.id}`)}>
      <img src={image} alt={movie.title} />
      <div>
        <h4>{movie.title}</h4>
        <small>{movie.release_date}</small>
      </div>
      <i className="fa-solid fa-circle-arrow-right"></i>
    </div>
  );
};

export default MovieCard;