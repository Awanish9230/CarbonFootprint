// backend/services/assistantService.js
import 'dotenv/config';
import fetch from 'node-fetch';

export async function generateAssistantReply({ history30d, forecast, plan, benchmark, question }) {
  const sys = 'You are a friendly, concise sustainability assistant. Use the provided numbers exactly and give one actionable tip.';
  const user = `Here is the user's context:
Recent 30d total: ${history30d?.totalCO2?.toFixed?.(2) ?? history30d?.totalCO2}
Recent 30d by category: ${JSON.stringify(history30d?.breakdown || {})}
Forecast next 7: ${JSON.stringify(forecast?.next7 || {})}
Forecast next 30: ${JSON.stringify(forecast?.next30 || {})}
Reduction plan (short/medium/long): ${JSON.stringify(plan?.plan || {})}
Benchmark: ${JSON.stringify(benchmark || {})}

User question: ${question}

Answer in 2-4 sentences, reference specific numbers when helpful, and end with one concrete recommendation aligned with their plan.`;

  try {
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gemini-2.5-flash',
          messages: [
            { role: 'system', content: sys },
            { role: 'user', content: user },
          ],
        }),
      }
    );
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content?.trim?.();
    if (content) return content;
  } catch (e) {
  }

  // Fallback: local concise answer
  const tip = plan?.plan?.shortTerm?.[0]?.action || 'Replace two car trips with walking this week';
  return `Based on your recent data, your next-7-day forecast is ${forecast?.next7?.total?.toFixed?.(1) ?? '?'} kg CO₂. ${benchmark?.highlight ? `Your ${benchmark.highlight} is higher than peers—` : ''}focus on it first. Try this: ${tip}.`;
}

