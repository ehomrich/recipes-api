'use strict';

const axios = require('axios');

function get(query) {
  const request = axios.get(process.env.GIPHY_API, {
    params: {
      api_key: process.env.GIPHY_API_KEY,
      limit: 1,
      q: query
    }
  });

  return request
    .then(response => {
      return (response.data.data.length ?
        response.data.data[0].images.original.url :
        'No gifs found');
    });
}

module.exports.get = get;
