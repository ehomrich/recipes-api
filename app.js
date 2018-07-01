'use strict';

const express = require('express');
const axios = require('axios');

const app = express();

const RECIPEPUPPY_API = 'http://www.recipepuppy.com/api/';
const GIPHY_API = 'http://api.giphy.com/v1/gifs/search';
const GIPHY_API_KEY = process.env.GIPHY_API_KEY;

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/giphy/', (req, res) => {
  getGif(req.query.q)
    .then(results => {
      res.send(results.data.data[0].images.original.url);
    })
    .catch(error => {
      res.send({
        status: error.response.status,
        message: error.message
      });
    });
});

function getGif(query) {
  return axios.get(GIPHY_API, {
    params: {
      api_key: GIPHY_API_KEY,
      limit: 1,
      q: query
    }
  });
}

module.exports = app;
