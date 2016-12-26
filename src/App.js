import React from 'react';
import debounce from 'lodash.debounce';
import { search, loadDetails, loadRatings } from './Api';
import MoviePreview from './moviepreview/MoviePreview';
import MovieCard from './moviecard/MovieCard';
import './App.css';
import searchIcon from './ressources/search-icon.svg';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      onSearch: false,
      searchedMovies: [],
      mainMovie: {},
      recommendations: new Map(),
      searchValue: '',
    };
    this.onSearch = debounce(this.onSearch, 500);
  }

  onSearch = (value) => {
    search(value).then((movies) => {
      this.setState({ searchedMovies: movies, onSearch: true })
    });
  }

  onInputChange = (event) => {
    if (event.target.value && event.target.value.length > 2) {
      this.setState({ searchValue: event.target.value })
      this.onSearch(event.target.value);
    } else {
      this.setState({ searchedMovies: [], onSearch: false, searchValue: event.target.value })
    }
  }

  handleRecommendationsSearch = (movie) => {
    movie.recommendations.forEach((recommendedMovie) => {
      loadRatings(recommendedMovie.title).then((recommendedMovieRatings) => {
        this.setState((prevState) => {
          prevState.recommendations.set(recommendedMovieRatings.imdbID, { ...recommendedMovie, ...recommendedMovieRatings})
          return ({ recommendations: prevState.recommendations });
        });
      })
    })
  }

  onSearchedMovieClick = ({ id, title }) => {
    this.setState({
      mainMovie: {},
      searchedMovies: [],
      recommendations: new Map(),
      onSearch: false,
      searchValue: '',
    });
    loadDetails(id).then((movie) => {
      this.setState((prevState) => ({ mainMovie: { ...prevState.mainMovie, ...movie } }));
      this.handleRecommendationsSearch(movie);
    });
    loadRatings(title).then(movie => {
      this.setState((prevState) => ({ mainMovie: { ...prevState.mainMovie, ...movie } }));
    });
  }

  onDetailedMovieClick = (movie) => {
    this.setState(() => ({ mainMovie: movie, recommendations: new Map() }));
    loadDetails(movie.id).then((detailledMovie) => {
      this.setState((prevState) => ({ mainMovie: { ...prevState.mainMovie, ...detailledMovie } }));
      this.handleRecommendationsSearch(detailledMovie);
    });
  }

  onFormSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
  }

  render() {
    const recommendationKeys = [...this.state.recommendations.keys()];
    return (
      <div>
        <header className="App-header">
          <h1>{'Movie match & rate'}</h1>
        </header>
        <main className="App-main">
          <form role="form" className="App-form" onSubmit={this.onFormSubmit}>
            <img className="App-search-icon"  src={searchIcon} alt=""/>
            <input type="search" className="App-search-input" placeholder="Search" onChange={this.onInputChange} value={this.state.searchValue}/>
            <div className="App-search-autocomplete" >
              {this.state.onSearch && this.state.searchValue.length > 2 && this.state.searchedMovies.map((searchedMovie) => (
                <MoviePreview key={searchedMovie.id} movie={searchedMovie} onClick={this.onSearchedMovieClick}/>
              ))}
            </div>
          </form>
          <div className="App-main-container">
            <div className="App-main-content">
              {this.state.mainMovie.title ?
                <MovieCard key={this.state.mainMovie.id} movie={this.state.mainMovie} onClick={this.onDetailedMovieClick}/>
              : false}
              {recommendationKeys.length > 0 ?
                <p className="App-movie-recommendations">
                  {'Similar recommended movies: '}
                </p>
              : false}
              {recommendationKeys.map((id) => (
                <MovieCard key={id} movie={this.state.recommendations.get(id)} onClick={this.onDetailedMovieClick} />
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App;
