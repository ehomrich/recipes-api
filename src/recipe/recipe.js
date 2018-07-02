'use strict';

const axios = require('axios');
const gif = require('../gif')

async function getRecipes(req, res, next) {
  let ingredients;
  let output = [];

  try {
    ingredients = parseParameter(req.query.i);
    const recipes = await findRecipesByIngredients(req.query.i);

    for (const recipe of recipes) {
      let recipeTitle = recipe.title.trim();
      let recipeGif = await gif.get(recipeTitle);

      output.push({
        title: recipeTitle,
        ingredients: organizeIngredients(recipe.ingredients),
        link: recipe.href,
        gif: recipeGif
      });
    }
  } catch (err) {
    return next(err);
  }

  res.json({
    keywords: ingredients,
    recipes: output
  });
}

function findRecipesByIngredients(ingredients) {
  let request = axios.get(process.env.RECIPE_PUPPY_API, {
    params: {
      i: ingredients
    }
  });

  return request.then(response => {
    return response.data.results;
  });
}

function organizeIngredients(ingredients) {
  return ingredients.split(', ').filter(x => x).sort();
}

function parseParameter(parameter) {
  let output = parameter.split(/,\s*/).filter(x => x);

  if (output.length === 0 || output.length > 3) {
    throw new TypeError();
  }

  return output;
}

module.exports = {
  getRecipes: getRecipes,
  findRecipesByIngredients: findRecipesByIngredients,
  parseParameter: parseParameter
}
