import React, { useState, useEffect } from "react";
import api from "../api/axios";

export default function SearchBar({ query, setQuery, onSearch }) {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (query.length === 0) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const res = await api.get(`/items/suggestions?q=${query}`);
        setSuggestions(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSuggestions();
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedQuery = query.trim(); // trim whitespace
    setQuery(trimmedQuery);
    onSearch(trimmedQuery);
    setSuggestions([]);
  };

  const handleSelect = (suggestion) => {
    const trimmedSuggestion = suggestion.trim(); // trim whitespace
    setQuery(trimmedSuggestion);
    onSearch(trimmedSuggestion);
    setSuggestions([]);
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Search an item..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-lg text-white font-medium bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 transition"
        >
          Search
        </button>
      </form>

      {/* Suggestions dropdown */}
      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-md mt-1 max-h-60 overflow-y-auto">
          {suggestions.map((s, idx) => (
            <li
              key={idx}
              className="px-4 py-2 hover:bg-blue-500 hover:text-white cursor-pointer transition"
              onClick={() => handleSelect(s)}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
