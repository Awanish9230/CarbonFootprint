import React, { useState } from 'react';
import api from '../api/axios';

export default function EmissionForm({ onLogged }) {
  const [form, setForm] = useState({
    vehicleKm: '',
    electricityKwh: '',
    shoppingSpend: '',
    foodKgCO2e: ''
  });
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convert all fields to numbers
      const payload = Object.fromEntries(
        Object.entries(form).map(([k, v]) => [k, Number(v) || 0])
      );

      console.log('Submitting payload:', payload);

      // POST to backend with JWT automatically from axios instance
      const res = await api.post('/emissions/log', payload);

      console.log('API Response:', res.data);

      // Call parent callback to refresh dashboard or summary
      onLogged && onLogged(res.data);

      // Reset form
      setForm({
        vehicleKm: '',
        electricityKwh: '',
        shoppingSpend: '',
        foodKgCO2e: ''
      });
    } catch (err) {
      console.error('Error submitting emission log:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Failed to log emission. Make sure you are logged in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Inputs */}
      <input
        type="number"
        min="0"
        className="px-4 py-2 rounded-lg bg-[#1a1a1a] border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Vehicle (km)"
        name="vehicleKm"
        value={form.vehicleKm}
        onChange={onChange}
      />
      <input
        type="number"
        min="0"
        className="px-4 py-2 rounded-lg bg-[#1a1a1a] border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Electricity (kWh)"
        name="electricityKwh"
        value={form.electricityKwh}
        onChange={onChange}
      />
      <input
        type="number"
        min="0"
        className="px-4 py-2 rounded-lg bg-[#1a1a1a] border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Shopping (INR)"
        name="shoppingSpend"
        value={form.shoppingSpend}
        onChange={onChange}
      />
      <input
        type="number"
        min="0"
        className="px-4 py-2 rounded-lg bg-[#1a1a1a] border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Food (kgCO2e)"
        name="foodKgCO2e"
        value={form.foodKgCO2e}
        onChange={onChange}
      />

      {/* Submit Button */}
      <button
        disabled={loading}
        className="col-span-1 sm:col-span-2 px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium transition"
      >
        {loading ? 'Saving...' : 'Log Emissions'}
      </button>
    </form>
  );
}
