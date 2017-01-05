import React from 'react';
import debounce from 'lodash.debounce';
import { search, loadDetails, loadRatings } from './Api';
import MoviePreview from './moviepreview/MoviePreview';
import MovieCard from './moviecard/MovieCard';
import './App.css';
import searchIcon from './ressources/searchIcon.svg';
import themoviedblogo from './ressources/themoviedblogo.svg';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      onSearch: false,
      searchedMovies: [],
      mainMovie: {},
      recommendations: new Map(),
      searchValue: '',
      fixedSearchBar: false,
    };
    this.onSearch = debounce(this.onSearch, 200);
    this.handleScroll = debounce(this.handleScroll, 20);
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

  handleScroll = () => {
    if (!this.state.fixedSearchBar && this.scrollContent.scrollTop > 50) {
      this.setState({ fixedSearchBar: true })
    } else if (this.state.fixedSearchBar && this.scrollContent.scrollTop < 51) {
      this.setState({ fixedSearchBar: false })
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
      <div className="App" onScroll={this.handleScroll} ref={(ref) => this.scrollContent = ref} >
        <header className="App-header">
          <h1>{'Movie match & rate'}</h1>
        </header>
        <main>
          <form role="form" className={`App-form${this.state.fixedSearchBar ? ' App-form-fixed' : ''}`} onSubmit={this.onFormSubmit}>
            <img className="App-search-icon" src={searchIcon} width="24" height="24" alt=""/>
            <input type="search" className="App-search-input" placeholder="Search" onChange={this.onInputChange} value={this.state.searchValue}/>
            <div className={`App-search-autocomplete${this.state.fixedSearchBar ? ' App-search-autocomplete-fixed': ''}`}>
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
            <footer className="App-footer">
              <p className="App-footer-meta-logo">
                <span className="App-footer-meta">{'Similar movies recommendations'}</span>
                <img src={themoviedblogo} width="58" height="23" alt="TMdb Logo" />
              </p>
              <p className="App-footer-tmdb">{'This product uses the TMDb API but is not endorsed or certified by TMDb.'}</p>
              <p className="App-footer-omdb">
                <span>{'Ratings provided thanks to '}</span>
                <a href="https://www.omdbapi.com/">{'omdbapi.com'}</a>
              </p>
            </footer>
          </div>
        </main>
      </div>
    );
  }
}

export default App;
