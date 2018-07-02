'use strict';

const axios = require('axios');
const express = require('express');
const router = express.Router();

const RECIPEPUPPY_API = 'http://www.recipepuppy.com/api/';
const GIPHY_API = 'http://api.giphy.com/v1/gifs/search';
const GIPHY_API_KEY = process.env.GIPHY_API_KEY;

router.get('/', (req, res) => {
  res.send('Hello world!');
});

router.get('/recipes/', async (req, res, next) => {
  try {
    const ingredients = parseInput(req.query.i);

    const recipes = await getRecipes(req.query.i);

    const output = [];

    for (const recipe of recipes) {
      const recipeTitle = recipe.title.trim();

      const recipeGif = await getGif(recipeTitle);

      output.push({
        title: recipeTitle,
        ingredients: recipe.ingredients.split(', ').sort(),
        link: recipe.href,
        gif: recipeGif
      });
    }

    res.json({
      keywords: ingredients,
      recipes: output
    });
  } catch (err) {
    return next(err);
  }
});

function parseInput(parameter) {
  const output = parameter.split(/,\s*/).filter(x => x);

  if (output.length === 0 || output.length > 3) {
    throw new TypeError();
  }

  return output;
}

function getRecipes(ingredients) {
  let request = axios.get(RECIPEPUPPY_API, {
    headers: {},
    params: {
      i: ingredients
    }
  });

  return request.then(response => {
    return response.data.results;
  });
}

function getGif(query) {
  let request = axios.get(GIPHY_API, {
    headers: {},
    params: {
      api_key: GIPHY_API_KEY,
      limit: 1,
      q: query
    }
  });

  return request
    .then(result => {
      if (result.data.data.length) {
        return result.data.data[0].images.original.url;
      } else {
        return 'No gifs found';
      }
    });
}

module.exports = router;
