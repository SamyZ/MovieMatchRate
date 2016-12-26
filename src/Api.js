import 'whatwg-fetch';

const THEMOVIEDB_API_KEY = '3d368cb19b427fa7c6c3327f4a1f2b47'; // TODO put on a proxy API server to prevent API key theft
const LANGUAGE = 'en-US';
const PAGE = 1;
const INCLUDE_ADULT = false;

const movieDbParams = {
  api_key: THEMOVIEDB_API_KEY,
  language: LANGUAGE,
}

const defaultHeaders = new Headers({
  Accept: 'application/json',
});

const queryString = (params) => {
  let queryParams = '';
  Object.keys(params).forEach(param => {
    queryParams += `&${encodeURI(param)}=${encodeURI(params[param])}`;
  })
  if (queryParams !== '') {
    return queryParams.substring(1);
  }
  return null;
}

const sortPopularity = (a, b) => {
  if (a.popularity > b.popularity) return -1;
  if (a.popularity < b.popularity) return 1;
  return 0;
}

export const search = (value) => {
  const url = 'https://api.themoviedb.org/3/search/movie';
  const params = {
    ...movieDbParams,
    page: PAGE,
    include_adult: INCLUDE_ADULT,
    query: value,
  };
  const queryParams = queryString(params);
  const requestUrl = `${url}?${queryParams}`;

  return fetch(requestUrl, {
    headers: defaultHeaders,
  }).then((response) => response.json())
    .then((json) => {
      const movies = json.results;
      const relevantMovies = [];
      for (let i = 0, length = movies.length; i < length; i++) {
        if (movies[i].vote_count > 2) { // Only take recognized movies for now
          relevantMovies.push(movies[i]);
        }
      }
      return relevantMovies.sort(sortPopularity);
    })
    .catch((ex) => {
      console.log('parsing failed', ex)
    })
}

export const loadDetails = (id) => {
  const url = `https://api.themoviedb.org/3/movie/${id}`;
  const params = {
    ...movieDbParams,
    append_to_response: 'recommendations'
  };
  const queryParams = queryString(params);
  const requestUrl = `${url}?${queryParams}`;

  return fetch(requestUrl, {
    headers: defaultHeaders,
  }).then((response) => response.json())
    .then((json) => {
      json.recommendations = json.recommendations.results.splice(0, 10); // Flattenning recommendations
      return json;
    })
    .catch((ex) => {
      console.log('parsing failed', ex)
    })
}

export const loadRatings = (title) => {
  const url = 'https://www.omdbapi.com/';
  const params = {
    t: title,
    tomatoes: true,
    // plot: 'full',
};
  const queryParams = queryString(params);
  const requestUrl = `${url}?${queryParams}`;

  return fetch(requestUrl, {
    headers: defaultHeaders,
  }).then((response) => response.json())
    .catch((ex) => {
      console.log('parsing failed', ex)
    })
}
