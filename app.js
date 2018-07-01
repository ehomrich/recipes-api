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

module.exports = app;
