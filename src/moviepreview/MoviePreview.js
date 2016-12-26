import React from 'react';
import './MoviePreview.css';

const POSTER_URL = 'https://image.tmdb.org/t/p/w45_and_h67_bestv2'

const proptypes = {
  onClick: React.PropTypes.func,
  movie: React.PropTypes.object,
};

const MoviePreview = ({ onClick, movie }) => (
  <div className="Movie-preview" onClick={() => onClick(movie)}>
    <img src={`${POSTER_URL}${movie.poster_path}`} alt=""/>
    <p className="Movie-preview-title">{movie.title}</p>
  </div>
);

MoviePreview.proptypes = proptypes;
export default MoviePreview;
