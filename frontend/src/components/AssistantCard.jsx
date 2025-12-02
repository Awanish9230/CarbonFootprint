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
      setAnswer(typeof res === 'string' ? res : (res?.message || ''));
    } catch (e) {
      setAnswer('Sorry, I could not fetch an answer right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white text-gray-900 border border-gray-200 rounded-2xl p-6 shadow-sm dark:bg-gradient-to-br dark:from-gray-800 dark:via-gray-900 dark:to-black dark:border-gray-700 dark:text-white">
      <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Sustainability Assistant</h3>
      <div className="flex flex-col md:flex-row gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Ask something about your footprint..."
          className="flex-1 bg-white text-gray-900 border border-gray-300 rounded-xl px-3 py-2 dark:bg-gray-900 dark:text-white dark:border-gray-700"
        />
        <button
          onClick={onAsk}
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-50"
        >
          {loading ? 'Asking...' : 'Ask'}
        </button>
      </div>
      {answer && (
        <div className="mt-4 rounded-xl p-4 whitespace-pre-wrap bg-gray-50 text-gray-800 border border-gray-200 dark:bg-gray-900/40 dark:text-gray-200 dark:border-gray-700">
          {answer}
        </div>
      )}
    </div>
  );
}