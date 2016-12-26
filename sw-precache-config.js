module.exports = {
  stripPrefix: 'build/',
  staticFileGlobs: [
    'build/*.html',
    'build/manifest.json',
    'build/static/**/!(*map*)'
  ],
  dontCacheBustUrlsMatching: /\.\w{8}\./,
  swFilePath: 'build/service-worker.js',
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/www\.omdbapi\.com\/*/,
      handler: 'cacheFirst'
    },
    {
      urlPattern: /^https:\/\/api\.themoviedb\.org\/*/,
      handler: 'cacheFirst'
    },
    {
      urlPattern: /^https:\/\/image\.tmdb\.org\/*/,
      handler: 'cacheFirst'
    }
  ],
};
