const request = require('supertest');
const app = require('../app');

describe('Health & 404', () => {
  it('GET / -> 200 with a message', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Recipe API is running!');
  });

  it('GET /api/nope -> 404 with {error}', async () => {
    const res = await request(app).get('/api/nope');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error', 'Not found');
  });
});

