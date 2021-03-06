import React from 'react';
import './MovieCard.css';
import MovieRating from '../movierating/MovieRating';

const POSTER_URL = 'https://image.tmdb.org/t/p/w154'

const proptypes = {
  onClick: React.PropTypes.func,
  movie: React.PropTypes.object,
};

const MovieCard = ({ onClick, movie }) => {
  let tomatoRating = movie.tomatoRating * 10;
  if (Array.isArray(movie.Ratings) && movie.Ratings.length > 2 && movie.Ratings[1].Value.indexOf('%') !== -1) {
    tomatoRating = movie.Ratings[1].Value.substring(0, movie.Ratings[1].Value.indexOf('%'))
  }
  return (
  <div className="Movie-card" onClick={() => onClick(movie)}>
    <div className="Movie-card-poster-title-ratings" >
      <img src={`${POSTER_URL}${movie.poster_path}`} alt=""/>
      <div className="Movie-card-title-ratings" >
        <p className="Movie-card-title">{movie.title}</p>
        <MovieRating label="IMDb" value={movie.imdbRating * 10} color="darkorange" />
        <MovieRating label="Rotten Tomatoes" value={tomatoRating} color="red" />
        {/* <MovieRating label="Audience Rating" value={0} color="green" /> */}
        <MovieRating label="Metascore" value={movie.Metascore} color="#1c85b8" />
      </div>
    </div>
    <div className="Movie-card-info" >
      <p className="Movie-card-genre-year">
        {`${movie.Genre}  -  ${movie.Year}`}
      </p>
      <p className="Movie-card-plot">
        {movie.Plot}
      </p>
      <p className="Movie-card-director">
        <span className="Movie-card-info-label">{'Director: '}</span>
        {movie.Director}
      </p>
      <p className="Movie-card-actor">
        <span className="Movie-card-info-label">{'Actors: '}</span>
        {movie.Actors}
      </p>
    </div>
  </div>
)};

MovieCard.proptypes = proptypes;
export default MovieCard;
