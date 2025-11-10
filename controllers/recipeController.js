const store = require('../data');

function validateRecipe(data) {
  const errors = {};
  if (!data || typeof data !== 'object') data = {};
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 3) {
    errors.name = 'Recipe name is required and must be at least 3 characters';
  }
  if (!Array.isArray(data.ingredients) || data.ingredients.length === 0) {
    errors.ingredients = 'At least one ingredient is required';
  }
  if (
    !data.instructions ||
    typeof data.instructions !== 'string' ||
    data.instructions.trim().length < 10
  ) {
    errors.instructions = 'Instructions are required and must be at least 10 characters';
  }
  return { ok: Object.keys(errors).length === 0, errors };
}

// GET /api/recipes
function list(req, res) {
  res.status(200).json(store.all());
}

// GET /api/recipes/:id
function get(req, res) {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) return res.status(400).json({ error: 'Invalid id' });
  const rec = store.byId(id);
  if (!rec) return res.status(404).json({ error: 'Recipe not found' });
  res.status(200).json(rec);
}

// POST /api/recipes
function create(req, res) {
  const { ok, errors } = validateRecipe(req.body);
  if (!ok) return res.status(400).json({ error: 'Validation failed', details: errors });
  const newRec = store.create({
    name: req.body.name.trim(),
    ingredients: req.body.ingredients,
    instructions: req.body.instructions.trim(),
  });
  res.status(201).json(newRec);
}

module.exports = { list, get, create };
