const request = require('supertest');
const app = require('../app');
const store = require('../data');

// reset in-memory DB before each test to keep them independent
beforeEach(() => store.__reset());

describe('GET /api/recipes', () => {
  it('200 -> returns an array of recipes', async () => {
    const res = await request(app).get('/api/recipes');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});

describe('GET /api/recipes/:id', () => {
  it('200 -> returns by id', async () => {
    const res = await request(app).get('/api/recipes/1');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', 1);
  });

  it('404 -> not found for a missing id', async () => {
    const res = await request(app).get('/api/recipes/999');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error', 'Recipe not found');
  });

  it('400 -> invalid id (non-numeric)', async () => {
    const res = await request(app).get('/api/recipes/not-a-number');
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Invalid id');
  });
});

describe('POST /api/recipes', () => {
  it('201 -> creates a recipe when valid', async () => {
    const payload = {
      name: 'Test Pancakes',
      ingredients: ['flour', 'eggs', 'milk'],
      instructions: 'Mix ingredients and cook on griddle until golden brown.',
    };
    const res = await request(app).post('/api/recipes').send(payload);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe(payload.name);
  });

  it('400 -> missing name', async () => {
    const res = await request(app)
      .post('/api/recipes')
      .send({
        ingredients: ['x'],
        instructions: 'Long enough instructions.',
      });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Validation failed');
    expect(res.body.details).toHaveProperty('name');
  });

  it('400 -> empty ingredients', async () => {
    const res = await request(app).post('/api/recipes').send({
      name: 'Valid Name',
      ingredients: [],
      instructions: 'Long enough instructions.',
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.details).toHaveProperty('ingredients');
  });

  it('400 -> short instructions', async () => {
    const res = await request(app)
      .post('/api/recipes')
      .send({
        name: 'Valid Name',
        ingredients: ['x'],
        instructions: 'short',
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.details).toHaveProperty('instructions');
  });

  it('400 -> invalid JSON (caught by error middleware)', async () => {
    const res = await request(app)
      .post('/api/recipes')
      .set('Content-Type', 'application/json')
      .send('{"bad":'); // malformed JSON
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Invalid JSON');
  });
});

describe('PUT /api/recipes/:id', () => {
  it('200 -> updates when valid', async () => {
    const payload = {
      name: 'Updated Name',
      ingredients: ['a', 'b', 'c'],
      instructions: 'These are sufficiently long instructions.',
    };
    const res = await request(app).put('/api/recipes/1').send(payload);
    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({ id: 1, name: 'Updated Name' });
  });

  it('404 -> not found when id missing', async () => {
    const payload = {
      name: 'Updated Name',
      ingredients: ['a'],
      instructions: 'Long enough instructions.',
    };
    const res = await request(app).put('/api/recipes/999').send(payload);
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error', 'Recipe not found');
  });

  it('400 -> invalid id', async () => {
    const payload = {
      name: 'Updated Name',
      ingredients: ['a'],
      instructions: 'Long enough instructions.',
    };
    const res = await request(app).put('/api/recipes/abc').send(payload);
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Invalid id');
  });

  it('400 -> validation fails', async () => {
    const payload = {
      name: 'x', // too short
      ingredients: [], // invalid
      instructions: 'short', // too short
    };
    const res = await request(app).put('/api/recipes/1').send(payload);
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Validation failed');
    expect(res.body.details).toHaveProperty('name');
    expect(res.body.details).toHaveProperty('ingredients');
    expect(res.body.details).toHaveProperty('instructions');
  });
});

describe('DELETE /api/recipes/:id', () => {
  it('204 -> deletes existing', async () => {
    const res = await request(app).delete('/api/recipes/1');
    expect(res.statusCode).toBe(204);
    // Confirm it’s gone
    const check = await request(app).get('/api/recipes/1');
    expect(check.statusCode).toBe(404);
  });

  it('404 -> not found for missing id', async () => {
    const res = await request(app).delete('/api/recipes/999');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error', 'Recipe not found');
  });

  it('400 -> invalid id', async () => {
    const res = await request(app).delete('/api/recipes/abc');
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Invalid id');
  });
});

describe('Unknown routes', () => {
  it('GET /api/nope -> 404', async () => {
    const res = await request(app).get('/api/nope');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error', 'Not found');
  });
});
