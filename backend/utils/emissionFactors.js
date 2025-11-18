// emissionFactors.js
// Basic set of emission factors (kgCO2e per unit)
// Localized for India
const factors = [
  { name: 'vehicle_km', category: 'transport', unit: 'km', factor: 0.192 }, // car average
  { name: 'electricity_kwh', category: 'energy', unit: 'kWh', factor: 0.82 }, // India grid approx
  { name: 'shopping_inr', category: 'consumption', unit: 'INR', factor: 0.0006 }, // rough intensity per INR
  { name: 'food_kgco2e', category: 'food', unit: 'kgCO2e', factor: 1.0 },
  { name: 'lpg_kg', category: 'energy', unit: 'kg', factor: 3.0 },
  { name: 'rail_km', category: 'transport', unit: 'km', factor: 0.041 },
  { name: 'bus_km', category: 'transport', unit: 'km', factor: 0.105 },
  { name: 'cycle_km', category: 'transport', unit: 'km', factor: 0.0 },
  { name: 'beef_kg', category: 'food', unit: 'kg', factor: 27.0 },
  { name: 'chicken_kg', category: 'food', unit: 'kg', factor: 6.9 },
  { name: 'vegetables_kg', category: 'food', unit: 'kg', factor: 2.0 },

  // --- New categories ---
  { name: 'flights_km', category: 'transport', unit: 'km', factor: 0.15 }, // avg short/medium flight
  { name: 'water_liters', category: 'water', unit: 'liter', factor: 0.0003 }, // water usage
  { name: 'waste_kg', category: 'waste', unit: 'kg', factor: 0.5 } // general waste
];

export default factors;
