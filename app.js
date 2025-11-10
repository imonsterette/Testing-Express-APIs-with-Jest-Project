// app.js — exports the Express app for tests; DOES NOT call listen()
const express = require('express');
const recipeRoutes = require('./routes/recipeRoutes');

const app = express();

// JSON body parsing
app.use(express.json());

// body-parse error trap: if JSON is malformed, return 400
// NOTE: 4 params -> Express treats it as error middleware
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({ error: 'Invalid JSON' });
  }
  next(err);
});

// simple health route (smoke test)
app.get('/', (req, res) => {
  res.json({ message: 'Recipe API is running!' });
});

// mount API routes
app.use('/api/recipes', recipeRoutes);

// global 404 for anything unmatched
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

module.exports = app;
