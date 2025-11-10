# Testing Express APIs with Jest — Recipe API

A minimal Express API with full tests (Jest + Supertest), clean structure, and pre-commit checks.

## Run
- Install: \`npm install\`
- Test: \`npm test\`
- Start: \`npm start\` (or \`npm run dev\` if you added nodemon)

## Endpoints (contract)
- **GET /api/recipes** → 200 \`[Recipe]\`
- **GET /api/recipes/:id** → 200 \`Recipe\` · 400 invalid id · 404 not found
- **POST /api/recipes** → 201 \`Recipe\` · 400 validation · 400 invalid JSON
- **PUT /api/recipes/:id** → 200 \`Recipe\` · 400 invalid id/validation · 404
- **DELETE /api/recipes/:id** → 204 · 400 invalid id · 404

## Sample
\`\`\`bash
curl -s http://localhost:3000/api/recipes | jq '.[:2]'
# -> first two recipes
\`\`\`

### Create
\`\`\`bash
curl -s -X POST http://localhost:3000/api/recipes \
  -H 'Content-Type: application/json' \
  -d '{"name":"Test Pancakes","ingredients":["flour","eggs","milk"],"instructions":"Mix and cook on griddle until golden."}'
\`\`\`

## Dev hygiene
- **Tests:** Jest + Supertest
- **Lint/Format:** ESLint + Prettier
- **Hooks:** Husky pre-commit runs \`npm run check\` (lint + tests)

## Structure
\`\`\`
app.js            # Express app (exported for tests)
server.js         # starts the app (no tests import this)
data.js           # in-memory store with __reset()
controllers/      # route handlers (validation here)
routes/           # express.Router() modules
tests/            # Jest test files
\`\`\`

## Notes
- Invalid JSON returns 400 via 4-arg error middleware.
- 400 = bad input; 404 = not found — consistent semantics.
