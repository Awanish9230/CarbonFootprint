// calculator.js
const factorsList = require('./emissionFactors');

const factorMap = factorsList.reduce((acc, f) => {
  acc[f.name] = f.factor;
  return acc;
}, {});

function computeFromInput(input = {}) {
  // Convert inputs to numbers
  const rawInput = {
    vehicleKm: Number(input.vehicleKm || 0),
    electricityKwh: Number(input.electricityKwh || 0),
    shoppingSpend: Number(input.shoppingSpend || 0),
    foodKgCO2e: Number(input.foodKgCO2e || 0),
    other: Number(input.other || 0)
  };

  // Apply emission factors to each category
  const breakdown = {
    vehicleKm: rawInput.vehicleKm * (factorMap['vehicle_km'] || 0),
    electricityKwh: rawInput.electricityKwh * (factorMap['electricity_kwh'] || 0),
    shoppingSpend: rawInput.shoppingSpend * (factorMap['shopping_inr'] || 0),
    foodKgCO2e: rawInput.foodKgCO2e * (factorMap['food_kgco2e'] || 0),
    other: rawInput.other // or multiply by a factor if needed
  };

  // Sum all to get total CO2
  const totalCO2 = Object.values(breakdown).reduce((sum, val) => sum + val, 0);

  return { totalCO2, breakdown };
}

module.exports = { computeFromInput, factorsList };
