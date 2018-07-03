'use strict';

const express = require('express');
const recipeRouter = require('./src/recipe');

const app = express();

app.get('/', (req, res) => {
  res.json({
    message: 'Hello world!'
  });
});

app.use('/recipes/', recipeRouter);
app.use(failedRequestHandler);
app.use(invalidCredentialsHandler);
app.use(tooManyRequestsHandler);
app.use(serviceUnavailableHandler);
app.use(invalidParameterHandler);

function failedRequestHandler(err, req, res, next) {
  if (err.response.status === 500) {
    res.status(503).json({
      status: 503,
      error: 'External service error',
      message: 'Request to Recipe Puppy API failed with status 500'
    });
  } else {
    next(err);
  }
}

function invalidCredentialsHandler(err, req, res, next) {
  const status = err.response.status;

  if (status === 401 || status === 403) {
    res.status(403).json({
      status: 403,
      error: 'Authentication failed',
      message: 'Invalid or missing authentication credentials for the Giphy API'
    });
  } else {
    next(err);
  }
}

function tooManyRequestsHandler(err, req, res, next) {
  if (err.response.status === 429) {
    res.status(503).json({
      status: 503,
      error: 'Too many requests sent',
      message: 'Too many requests were sent to the Giphy API in a short period of time'
    });
  } else {
    next(err);
  }
}

function serviceUnavailableHandler(err, req, res, next) {
  if (err.response.status === 503) {
    res.status(503).json({
      status: 503,
      error: 'Service(s) unavailable',
      message: 'Some external services (Recipe Puppy and/or Giphy) are currently unavailable'
    });
  } else {
    next(err);
  }
}

function invalidParameterHandler(err, req, res, next) {
  if (err instanceof TypeError) {
    res.status(400).json({
      status: 400,
      error: 'Invalid parameter',
      message: 'Incorrectly formatted request or missing required parameters'
    });
  } else {
    next(err);
  }
}

module.exports = app;
