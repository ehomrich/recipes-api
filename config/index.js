'use strict';

function checkVariables() {
  if (!process.env.RECIPE_PUPPY_API ||
    !process.env.GIPHY_API ||
    !process.env.GIPHY_API_KEY) {
    throw new Error('Improperly configured');
  }
}

module.exports = {
  checkVariables: checkVariables
}
