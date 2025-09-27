// calculator.js
const factorsList = require('./emissionFactors');

const factorMap = factorsList.reduce((acc, f) => {
  acc[f.name] = f.factor;
  return acc;
}, {});

/**
 * Compute CO2 emissions from user input
 * @param {Object} input - user input values
 * @returns {Object} { totalCO2, breakdown }
 */
function computeFromInput(input = {}) {
  const rawInput = {
    vehicleKm: Number(input.vehicleKm || 0),
    electricityKwh: Number(input.electricityKwh || 0),
    shoppingSpend: Number(input.shoppingSpend || 0),
    foodKgCO2e: Number(input.foodKgCO2e || 0),
    other: Number(input.other || 0),
    flightsKm: Number(input.flightsKm || 0),
    waterLiters: Number(input.waterLiters || 0),
    wasteKg: Number(input.wasteKg || 0)
  };

  const breakdown = {
    vehicleKm: rawInput.vehicleKm * (factorMap['vehicle_km'] || 0),
    electricityKwh: rawInput.electricityKwh * (factorMap['electricity_kwh'] || 0),
    shoppingSpend: rawInput.shoppingSpend * (factorMap['shopping_inr'] || 0),
    foodKgCO2e: rawInput.foodKgCO2e * (factorMap['food_kgco2e'] || 0),
    other: rawInput.other,
    flightsKm: rawInput.flightsKm * (factorMap['flights_km'] || 0),
    waterLiters: rawInput.waterLiters * (factorMap['water_liters'] || 0),
    wasteKg: rawInput.wasteKg * (factorMap['waste_kg'] || 0)
  };

  const totalCO2 = Object.values(breakdown).reduce((sum, val) => sum + val, 0);

  return { totalCO2, breakdown };
}


module.exports = { computeFromInput, factorsList };
