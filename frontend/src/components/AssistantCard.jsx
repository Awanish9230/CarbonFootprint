import React, { useState } from 'react';
import { askAssistant } from '../api/insights';

export default function AssistantCard() {
  const [q, setQ] = useState('Any quick wins for me this week?');
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState('');

  const onAsk = async () => {
    try {
      setLoading(true);
      const res = await askAssistant(q);
      // res is plain text when using fetch directly; axios returns response.data
      setAnswer(typeof res === 'string' ? res : (res?.message || ''));
    } catch (e) {
      setAnswer('Sorry, I could not fetch an answer right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black border border-gray-700 rounded-2xl p-6 text-white">
      <h3 className="text-xl font-bold mb-2">Sustainability Assistant</h3>
      <div className="flex flex-col md:flex-row gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Ask something about your footprint..."
          className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-white"
        />
        <button
          onClick={onAsk}
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50"
        >
          {loading ? 'Asking...' : 'Ask'}
        </button>
      </div>
      {answer && (
        <div className="mt-4 bg-gray-900/40 border border-gray-700 rounded-xl p-4 whitespace-pre-wrap text-gray-200">
          {answer}
        </div>
      )}
    </div>
  );
}