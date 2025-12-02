// emissionFactors.js

const factors = [
  { name: 'vehicle_km', category: 'transport', unit: 'km', factor: 0.192 }, 
  { name: 'electricity_kwh', category: 'energy', unit: 'kWh', factor: 0.82 }, 
  { name: 'shopping_inr', category: 'consumption', unit: 'INR', factor: 0.0006 }, 
  { name: 'food_kgco2e', category: 'food', unit: 'kgCO2e', factor: 1.0 },
  { name: 'lpg_kg', category: 'energy', unit: 'kg', factor: 3.0 },
  { name: 'rail_km', category: 'transport', unit: 'km', factor: 0.041 },
  { name: 'bus_km', category: 'transport', unit: 'km', factor: 0.105 },
  { name: 'cycle_km', category: 'transport', unit: 'km', factor: 0.0 },
  { name: 'meat_kg', category: 'food', unit: 'kg', factor: 27.0 },
  { name: 'chicken_kg', category: 'food', unit: 'kg', factor: 6.9 },
  { name: 'vegetables_kg', category: 'food', unit: 'kg', factor: 2.0 },
  { name: 'flights_km', category: 'transport', unit: 'km', factor: 0.15 }, 
  { name: 'water_liters', category: 'water', unit: 'liter', factor: 0.0003 },
  { name: 'waste_kg', category: 'waste', unit: 'kg', factor: 0.5 } 
];

export default factors;
