import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMovieDetails } from "../api";

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState("");

  useEffect(() => {
    getMovieDetails(id).then((res) => {
      setMovie(res.data);
    });
  }, [id]);

  if (!movie) return <p className="page">Loading...</p>;

  const imageUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

  const handleShowtimeSelect = (time) => {
    setSelectedShowtime(time);
  };

  const handleBooking = () => {
    if (!selectedShowtime) {
      alert("Please select a showtime first.");
      return;
    }

    navigate("/booking", {
      state: {
        movie,
        showtime: selectedShowtime,
      },
    });
  };

  return (
    <div className="page">
      <div style={{ display: "flex", gap: "50px", flexWrap: "wrap" }}>
        <img
          src={imageUrl}
          alt={movie.title}
          style={{
            width: "300px",
            borderRadius: "20px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
          }}
        />

        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: "48px", marginBottom: "10px" }}>
            {movie.title}
          </h1>

          <p
            style={{
              color: "var(--primary)",
              marginBottom: "20px",
              fontWeight: 600,
            }}
          >
            {movie.genres?.map((g) => g.name).join(" / ")}
          </p>

          <p
            style={{
              lineHeight: 1.8,
              color: "var(--text-dim)",
              marginBottom: "30px",
            }}
          >
            {movie.overview}
          </p>

          <h3 style={{ marginBottom: "15px" }}>Select Showtime</h3>

          <div
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "30px",
            }}
          >
            {["10:30 AM", "02:45 PM", "07:00 PM", "10:00 PM"].map(
              (time) => (
                <button
                  key={time}
                  className="btn glass-panel"
                  style={{
                    color: "white",
                    border:
                      selectedShowtime === time
                        ? "2px solid var(--primary)"
                        : "1px solid rgba(255,255,255,0.1)",
                  }}
                  onClick={() => handleShowtimeSelect(time)}
                >
                  {time}
                </button>
              )
            )}
          </div>

          <button
            className="btn btn-primary"
            style={{ width: "auto", padding: "15px 40px" }}
            onClick={handleBooking}
          >
            Book Tickets
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;