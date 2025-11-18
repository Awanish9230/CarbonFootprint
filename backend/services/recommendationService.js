import 'dotenv/config';
import fetch from 'node-fetch';

export async function getRecommendationsWithGemini(summary = {}) {
  const ruleRecs = [];
  let aiRecs = [];
  const b = summary.breakdown || {};

  // --- Enhanced Rule-Based Suggestions ---

  // Transport
  if (b.vehicle_km && b.vehicle_km > 50) {
    ruleRecs.push(
      'Reduce car usage for short trips (<5 km); walk, cycle, or use public transport at least 3 days/week.'
    );
  }

  if (b.flights_km && b.flights_km > 500) {
    ruleRecs.push(
      'Limit long-haul flights; consider virtual meetings and use carbon offset programs.'
    );
  }

  // Energy
  if (b.electricity_kwh && b.electricity_kwh > 10) {
    ruleRecs.push(
      'Use energy-efficient appliances, switch to LED lights, and run high-energy devices in off-peak hours.'
    );
  }

  if (b.other && b.other > 0) {
    ruleRecs.push(
      'Check other high-energy activities and try to reduce consumption wherever possible.'
    );
  }

  // Consumption
  if (b.shopping_inr && b.shopping_inr > 500) {
    ruleRecs.push(
      'Prioritize durable, eco-friendly products; reduce impulse purchases and fast fashion.'
    );
  }

  // Food
  if (b.food_kgco2e != null) {
    if (b.food_kgco2e < 5) {
      ruleRecs.push(
        'Include more plant-based meals: try 3 vegetarian days per week and reduce red meat consumption.'
      );
    } else {
      ruleRecs.push(
        'Significantly reduce red meat and dairy; aim for 5 vegetarian days per week.'
      );
    }
  }

  // Water
  if (b.water_liters && b.water_liters > 200) {
    ruleRecs.push(
      'Reduce water usage: take shorter showers, fix leaks, and use water-saving appliances.'
    );
  }

  // Waste
  if (b.waste_kg && b.waste_kg > 2) {
    ruleRecs.push(
      'Increase recycling and composting; avoid single-use plastics and unnecessary packaging.'
    );
  }

  // Optional: Healthy habits for carbon + lifestyle
  if (b.vegetables_kg && b.vegetables_kg < 2) {
    ruleRecs.push(
      'Incorporate more vegetables into meals; plant-based diets reduce both CO₂ and improve health.'
    );
  }

  // --- AI-based suggestions using Gemini ---
  try {
    const geminiPrompt = `
You are an expert in sustainability. Given the following user summary data:
${JSON.stringify(summary, null, 2)}

Generate 3 actionable and personalized recommendations to help reduce their CO2 footprint, focusing on the highest contributors. Be specific, measurable, and realistic. Return suggestions as a JSON array of strings without any extra text.
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

  // Deduplicate
  const uniqueRuleRecs = Array.from(new Set(ruleRecs));
  const uniqueAiRecs = Array.from(new Set(aiRecs));

  return {
    ruleBased: uniqueRuleRecs.slice(0, 5),
    aiBased: uniqueAiRecs.slice(0, 5)
  };
}

