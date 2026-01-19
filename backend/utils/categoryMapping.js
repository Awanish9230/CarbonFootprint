// backend/utils/categoryMapping.js
// Map fine-grained breakdown keys to 4 high-level categories used in analytics
// transport, food, energy, waste

const CATEGORY_MAP = {
  transport: [
    'vehicle_km',
    'bus_km',
    'rail_km',
    'flights_km',
    'cycle_km',
  ],
  food: [
    'food_kgco2e',
    'beef_kg',
    'chicken_kg',
    'vegetables_kg',
  ],
  energy: [
    'electricity_kwh',
    'lpg_kg',
    'water_liters',
  ],
  waste: [
    'waste_kg',
    'shopping_inr',
    'other',
  ],
};

function breakdownToFourCategories(breakdown = {}) {
  const result = { transport: 0, food: 0, energy: 0, waste: 0 };
  for (const [cat, keys] of Object.entries(CATEGORY_MAP)) {
    result[cat] = keys.reduce((sum, k) => sum + Number(breakdown[k] || 0), 0);
  }
  return result;
}

// module.exports = { CATEGORY_MAP, breakdownToFourCategories };
export { CATEGORY_MAP, breakdownToFourCategories };
