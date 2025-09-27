const factorsList = require('./emissionFactors');

const factorMap = factorsList.reduce((acc, f) => {
  acc[f.name] = f.factor;
  return acc;
}, {});

function computeFromInput(input = {}) {
  const breakdown = {
    vehicleKm: Number(input.vehicleKm || 0),
    electricityKwh: Number(input.electricityKwh || 0),
    shoppingSpend: Number(input.shoppingSpend || 0),
    foodKgCO2e: Number(input.foodKgCO2e || 0),
    other: Number(input.other || 0)
  };

  const totalCO2 =
    breakdown.vehicleKm * (factorMap['vehicle_km'] || 0) +
    breakdown.electricityKwh * (factorMap['electricity_kwh'] || 0) +
    breakdown.shoppingSpend * (factorMap['shopping_inr'] || 0) +
    breakdown.foodKgCO2e * (factorMap['food_kgco2e'] || 0) +
    breakdown.other;

  return { totalCO2, breakdown };
}

module.exports = { computeFromInput, factorsList };
