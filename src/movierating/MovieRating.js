import React from 'react';
import './MovieRating.css';

const proptypes = {
  label: React.PropTypes.string,
  movie: React.PropTypes.number,
  color: React.PropTypes.string,
};

const MovieRating = ({ label, value, color }) => (
  <div className="Movie-rating">
    <p className="Movie-rating-label" style={{ "color": color }}>{label}</p>
    <div className="Movie-rating-progress-bar">
      <div className="Movie-rating-bar" style={{ "width": `${value}%` }}>
        <p className="Movie-rating-bar-value">{`${value}%`}</p>
      </div>
    </div>
  </div>
)

MovieRating.proptypes = proptypes;
export default MovieRating;
