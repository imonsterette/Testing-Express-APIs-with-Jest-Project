// data.js — minimal in-memory store with reset for deterministic tests
const initial = [
  {
    id: 1,
    name: 'Spaghetti Carbonara',
    ingredients: ['400g spaghetti', '200g pancetta', '4 eggs', '100g cheese'],
    instructions:
      'Cook pasta in salted water. Fry pancetta. Mix eggs with cheese. Combine off heat.'
  },
  {
    id: 2,
    name: 'Avocado Toast',
    ingredients: ['2 slices bread', '1 avocado', 'lemon juice', 'salt'],
    instructions:
      'Toast bread. Mash avocado with lemon and salt. Spread on toast.'
  },
  {
    id: 3,
    name: 'Greek Salad',
    ingredients: ['tomatoes', 'cucumber', 'feta', 'olives', 'olive oil'],
    instructions: 'Chop vegetables. Add feta and olives. Dress with olive oil.'
  }
];

let rows = JSON.parse(JSON.stringify(initial));
let nextId = initial.length + 1;

module.exports = {
  all: () => rows,
  byId: (id) => rows.find((r) => r.id === id),
  create: ({ name, ingredients, instructions }) => {
    const rec = { id: nextId++, name, ingredients, instructions };
    rows.push(rec);
    return rec;
  },
  update: (id, { name, ingredients, instructions }) => {
    const idx = rows.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    const updated = { ...rows[idx], name, ingredients, instructions };
    rows[idx] = updated;
    return updated;
  },
  remove: (id) => {
    const idx = rows.findIndex((r) => r.id === id);
    if (idx === -1) return false;
    rows.splice(idx, 1);
    return true;
  },
  __reset: () => {
    rows = JSON.parse(JSON.stringify(initial));
    nextId = initial.length + 1;
  }
};
