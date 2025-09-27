require('dotenv').config(); // Load .env
const fetch = require('node-fetch'); // Make sure node-fetch is installed

async function getRecommendationsWithGemini(summary = {}) {
  const ruleRecs = [];
  let aiRecs = [];
  const b = summary.breakdown || {};

  // --- Rule-based suggestions ---
if (b.vehicleKm && b.vehicleKm > 50) {
  ruleRecs.push(
    'Consider replacing short car trips with cycling or public transport at least 2 days/week.'
  );
}

if (b.electricityKwh && b.electricityKwh > 10) {
  ruleRecs.push(
    'Shift heavy appliance use to off-peak hours and replace old bulbs with LEDs.'
  );
}

if (b.shoppingSpend && b.shoppingSpend > 500) {
  ruleRecs.push(
    'Reduce impulse purchases; prefer durable, repairable items with eco-labels.'
  );
}

if (b.foodKgCO2e != null) {
  if (b.foodKgCO2e < 5) {
    ruleRecs.push('Try vegetarian meals 3 days/week and reduce red meat consumption.');
  } else {
    ruleRecs.push('Try vegetarian meals 5 days/week and reduce red meat consumption.');
  }
}

if (b.flightHours && b.flightHours > 5) {
  ruleRecs.push('Consider reducing long-haul flights or use carbon offset programs.');
}

if (b.waterL && b.waterL > 200) {
  ruleRecs.push('Take shorter showers and fix leaking taps to save water.');
}

if (b.wasteKg && b.wasteKg > 2) {
  ruleRecs.push('Increase recycling and composting; avoid single-use plastics.');
}

if (b.heatingKwh && b.heatingKwh > 15) {
  ruleRecs.push('Lower thermostat by 1–2°C and insulate your home to save energy.');
}

if (b.publicTransportKm && b.publicTransportKm < 20) {
  ruleRecs.push('Try using public transport or carpooling for more trips.');
}

if (b.clothingSpend && b.clothingSpend > 300) {
  ruleRecs.push('Opt for sustainable clothing brands and buy fewer fast-fashion items.');
}

if (b.meatKg && b.meatKg > 4) {
  ruleRecs.push('Reduce meat consumption; try meat-free days twice a week.');
}

if (b.plasticUse && b.plasticUse > 1) {
  ruleRecs.push('Use reusable bags, bottles, and containers to minimize plastic waste.');
}

if (b.electricVehicleKm && b.electricVehicleKm < 10) {
  ruleRecs.push('Consider switching to an electric vehicle or hybrid for shorter commutes.');
}


  // --- AI-based suggestions using Gemini ---
  try {
    const geminiPrompt = `
You are an expert in sustainability. Given the following user summary data:
${JSON.stringify(summary, null, 2)}

Generate 3 actionable and personalized recommendations to help reduce their CO2 footprint, considering their biggest contributors. Be specific and measurable. Return suggestions as a JSON array of strings.
Do NOT include Markdown syntax or extra text—output only valid JSON.
`;

    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gemini-2.5-flash',
          messages: [
            { role: 'system', content: 'You are a helpful sustainability advisor.' },
            { role: 'user', content: geminiPrompt }
          ]
        })
      }
    );

    const data = await response.json();
    let geminiContent = data.choices?.[0]?.message?.content || '';

    // Remove any Markdown or ```json syntax
    geminiContent = geminiContent.replace(/```json|```/gi, '').trim();

    // Parse as JSON, fallback to splitting lines
    try {
      const parsed = JSON.parse(geminiContent);
      if (Array.isArray(parsed)) aiRecs = parsed;
    } catch {
      aiRecs = geminiContent.split('\n').map((l) => l.trim()).filter(Boolean);
    }

  } catch (err) {
    console.error('Gemini API error:', err);
    aiRecs.push('Could not fetch AI-based recommendations this time. Please try again later.');
  }

  // Deduplicate each separately
  const uniqueRuleRecs = Array.from(new Set(ruleRecs));
  const uniqueAiRecs = Array.from(new Set(aiRecs));

  // RETURN AS SEPARATE ARRAYS
  return {
    ruleBased: uniqueRuleRecs.slice(0, 5),
    aiBased: uniqueAiRecs.slice(0, 5)
  };
}

module.exports = { getRecommendationsWithGemini };
