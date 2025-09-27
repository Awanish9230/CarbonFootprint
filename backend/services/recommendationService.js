async function getRecommendations(summary = {}) {
  const recs = [];
  const totals = summary.totalCO2 || 0;
  const b = summary.breakdown || {};

  if (b.vehicleKm && b.vehicleKm > 50) {
    recs.push('Consider replacing short car trips with cycling or public transport at least 2 days/week.');
  }
  if (b.electricityKwh && b.electricityKwh > 10) {
    recs.push('Shift heavy appliance use to off-peak hours and replace old bulbs with LEDs.');
  }
  if (b.shoppingSpend && b.shoppingSpend > 500) {
    recs.push('Reduce impulse purchases; prefer durable, repairable items with eco-labels.');
  }
  if (b.foodKgCO2e && b.foodKgCO2e < 5) {
    recs.push('Try vegetarian meals 3 days/week and reduce red meat consumption.');
  }else{
    recs.push('Try vegetarian meals 5 days/week and reduce red meat consumption.');
  }

  if (recs.length === 0) {
    recs.push('Great job! Keep tracking and aim for weekly goals like 20% reduction in car use.');
  }

  // AI stub: integrate with an external AI provider if desired
  // Example (disabled by default):
  // if (process.env.OPENAI_API_KEY) { ...call provider and augment recs }

  return recs;
}

module.exports = { getRecommendations };
