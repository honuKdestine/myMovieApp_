import React from "react";

const MovieCard = ({
  movie: { title, vote_average, poster_path, release_date, original_language },
}) => {
  //now instead of saying {movie.title} anytime, we destructure the movie object
  // and take what we want (the title) so we ccan jsut call it
  return (
    <div className="movie-card">
      <img
        src={
          poster_path // we check if there's a poster path, if there's we show it
            ? `https://image.tmdb.org/t/p/w500/${poster_path}`
            : "/no-movie.png"
        }
        alt={title}
      />
      <div className="mt-4">
        <h3>{title}</h3>

        <div className="content">
          <div className="rating">
            <img src="star.png" alt="Star Icon" />
            <p>{vote_average ? vote_average.toFixed(1) : "N/A"}</p>
          </div>

          <span>◦</span>

          <p className="lang">{original_language}</p>

          <span>◦</span>
          <p className="year">
            {release_date ? release_date.split("-")[0] : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;

{
  /* <p className="text-white">{title}</p> */
}
