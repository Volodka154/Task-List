// apollo.config.js
module.exports = {
    client: {
      service: {
        name: 'app',
        // URL to the GraphQL API
        url: 'http://localhost:5555/graphql',
      },
      // Files processed by the extension
      includes: [
        'src/**/*.vue',
        'src/**/*.js',
      ],
    },
  }