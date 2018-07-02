'use strict';

const express = require('express');
const router = express.Router();
const recipe = require('./recipe');

router.get('/', recipe.getRecipes);

module.exports = router;
