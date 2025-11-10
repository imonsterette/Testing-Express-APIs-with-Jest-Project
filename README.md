# Testing Express APIs with Jest Project — Recipe API

![CI](https://github.com/imonsterette/Testing-Express-APIs-with-Jest-Project/actions/workflows/ci.yml/badge.svg)

A minimal **Express** API with full tests (**Jest + Supertest**), clean structure, and **pre-commit hygiene** (ESLint + Prettier + Husky).
This is a backend API that exposes `/api/recipes` endpoints.  
It supports listing recipes, retrieving single recipes by id, creating new recipes, updating recipes, and deleting them.  
All behavior is covered by automated tests (Jest + Supertest) for both success & error cases.

## Getting Started

```bash
npm install        # install dependencies
npm test           # run full test suite
npm start          # start server on :3000
```

Then you can interact with the API using curl:

```bash
curl http://localhost:3000/api/recipes
```

## API Contract

| Route                     | Success          | Errors                                    |
| ------------------------- | ---------------- | ----------------------------------------- |
| GET `/api/recipes`        | 200 → `[Recipe]` | —                                         |
| GET `/api/recipes/:id`    | 200 → `Recipe`   | 400 invalid id · 404 not found            |
| POST `/api/recipes`       | 201 → `Recipe`   | 400 validation · 400 invalid JSON         |
| PUT `/api/recipes/:id`    | 200 → `Recipe`   | 400 invalid id/validation · 404 not found |
| DELETE `/api/recipes/:id` | 204 (no body)    | 400 invalid id · 404 not found            |

**Error shape:** `{"error":"...", "details"?: {...}}`  
**Invalid JSON** returns `400` via a 4-arg error middleware.

## Sample (curl)

```bash
# List
curl -s http://localhost:3000/api/recipes | jq '.[0]'

# Create
curl -s -X POST http://localhost:3000/api/recipes \
  -H 'Content-Type: application/json' \
  -d '{"name":"Test Pancakes","ingredients":["flour","eggs","milk"],"instructions":"Mix and cook on griddle until golden."}'

# Update
curl -s -X PUT http://localhost:3000/api/recipes/1 \
  -H 'Content-Type: application/json' \
  -d '{"name":"Updated Name","ingredients":["a","b","c"],"instructions":"These are sufficiently long instructions."}'

# Delete
curl -i -X DELETE http://localhost:3000/api/recipes/1
```

## Structure

```
app.js            # Express app (exported for tests)
server.js         # Entry (listens on PORT)
data.js           # In-memory store + __reset()
controllers/      # route handlers w/ validation
routes/           # express.Router() modules
tests/            # Jest + Supertest
jest.config.js    # Jest node env
eslint.config.cjs # ESLint v9 flat config
.prettierrc       # Prettier
```

## Dev Hygiene

- **Tests:** `npm test` (17 passing), no port binding during tests
- **Lint / Format:** `npm run lint` / `npm run format` (ESLint v9 + Prettier)
- **Hooks:** Husky pre-commit runs `npm run check`
- **CI:** GitHub Actions runs lint + tests on every push/PR (badge above)

## Notes

- `400` = bad input
- `404` = not found
- app/server split keeps test harness fast
- data store exposes `__reset()` so each test runs independent

## Technologies Used

- JavaScript (Node.js)
- Express
- Jest
- Supertest
- ESLint v9 (flat config)
- Prettier
- Husky (pre-commit)
- GitHub Actions (CI)

## Attributions

No external assets that require attribution.
