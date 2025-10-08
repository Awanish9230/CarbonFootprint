// utils/calculator.js
const factorsList = require('./emissionFactors');

// Create a map of emission factors for quick lookup
const factorMap = factorsList.reduce((acc, f) => {
  acc[f.name] = f.factor;
  return acc;
}, {});

// Compute emissions from input
function computeFromInput(input = {}) {
  // Map input keys safely (supports both camelCase and snake_case)
  const raw = {
    vehicle_km: Number(input.vehicle_km ?? input.vehicleKm ?? 0),
    electricity_kwh: Number(input.electricity_kwh ?? input.electricityKwh ?? 0),
    shopping_inr: Number(input.shopping_inr ?? input.shoppingSpend ?? 0),
    food_kgco2e: Number(input.food_kgco2e ?? input.foodKgCO2e ?? 0),
    flights_km: Number(input.flights_km ?? input.flightsKm ?? 0),
    water_liters: Number(input.water_liters ?? input.waterLiters ?? 0),
    waste_kg: Number(input.waste_kg ?? input.wasteKg ?? 0),
    lpg_kg: Number(input.lpg_kg ?? input.lpgKg ?? 0),
    rail_km: Number(input.rail_km ?? input.railKm ?? 0),
    bus_km: Number(input.bus_km ?? input.busKm ?? 0),
    cycle_km: Number(input.cycle_km ?? input.cycleKm ?? 0),
    beef_kg: Number(input.beef_kg ?? input.beefKg ?? 0),
    chicken_kg: Number(input.chicken_kg ?? input.chickenKg ?? 0),
    vegetables_kg: Number(input.vegetables_kg ?? input.vegetablesKg ?? 0),
    other: Number(input.other ?? 0),
  };

  // Compute breakdown using **snake_case keys only**
  const breakdown = {};
  for (const key in raw) {
    breakdown[key] = raw[key] * (factorMap[key] ?? 0);
  }

  // Sum total CO2
  const totalCO2 = Object.values(breakdown).reduce((sum, val) => sum + val, 0);

  return { totalCO2, breakdown };
}

module.exports = { computeFromInput, factorsList };
