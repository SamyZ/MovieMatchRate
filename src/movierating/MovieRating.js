import React from 'react';
import './MovieRating.css';

const proptypes = {
  label: React.PropTypes.string,
  movie: React.PropTypes.number,
  color: React.PropTypes.string,
};

const MovieRating = ({ label, value, color }) => {
  let rating = `${value}%`
  let ratingStyle = { "width": rating };
  if (!value || value === 'N/A') {
    rating = 'N/A';
    ratingStyle = { "width": "50%", "background-color": "grey" }
  }
  return (
    <div className="Movie-rating">
      <p className="Movie-rating-label" style={{ "color": color }}>{label}</p>
      <div className="Movie-rating-progress-bar">
        <div className="Movie-rating-bar" style={ratingStyle} >
          <p className="Movie-rating-bar-value">{rating}</p>
        </div>
      </div>
    </div>
);
}

MovieRating.proptypes = proptypes;
export default MovieRating;
