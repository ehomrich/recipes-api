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

app.get('/recipes/', (req, res) => {
  if (req.query === {} || !req.query.i) {
    res.status(400).send({
      error: 'You must provide at least one ingredient'
    });
  } else if (req.query.i.split(/,\s*/).length > 3) {
    res.status(400).send({
      error: 'Too many ingredients. You must provide 1 to 3 ingredients'
    });
  } else {
    getRecipes(req.query.i)
      .then(recipes => {
        res.json({
          keywords: req.query.i.split(/,\s*/),
          recipes: handleRecipes(recipes.data.results)
        });
      })
      .catch(error => {
        if (error.response.status === 500) {
          res.json({
            error: 'Request to Recipe Puppy API failed with status code 500'
          });
        }
      });
  }
});

app.get('/giphy/', (req, res) => {
  getGif(req.query.q)
    .then(results => {
      res.send(results.data.data[0].images.original.url);
    })
    .catch(error => {
      res.send(error.response);
    });
});

function getRecipes(ingredients) {
  return axios.get(RECIPEPUPPY_API, {
    params: {
      i: ingredients
    }
  });
}

function handleRecipes(recipes) {
  const processedRecipes = [];

  for (let recipe of recipes) {
    processedRecipes.push({
      title: recipe.title.trim(),
      ingredients: recipe.ingredients.split(', ').sort(),
      link: recipe.href,
      gif: null
    });
  }

  return processedRecipes;
}

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
