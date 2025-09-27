import React, { useState } from 'react';
import api from '../api/axios';

export default function EmissionForm({ onLogged }) {
  const [form, setForm] = useState({
    vehicleKm: '',
    electricityKwh: '',
    shoppingSpend: '',
    foodKgCO2e: '',
    flightsKm: '',
    waterLiters: '',
    wasteKg: ''
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

      // POST to backend
      const res = await api.post('/emissions/log', payload);
      console.log('API Response:', res.data);

      onLogged && onLogged(res.data);

      // Reset form
      setForm({
        vehicleKm: '',
        electricityKwh: '',
        shoppingSpend: '',
        foodKgCO2e: '',
        flightsKm: '',
        waterLiters: '',
        wasteKg: ''
      });
    } catch (err) {
      console.error('Error submitting emission log:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Failed to log emission. Make sure you are logged in.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "px-4 py-2 rounded-lg bg-[#1a1a1a] border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500";

  const buttonClass =
  "col-span-1 sm:col-span-2 px-5 py-2 rounded-lg text-white font-medium transition disabled:opacity-50 " +
  "bg-[linear-gradient(159deg,#0892d0,#4b0082)] hover:opacity-90";


  return (
    <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <input type="number" min="0" placeholder="Vehicle (km)" name="vehicleKm" value={form.vehicleKm} onChange={onChange} className={inputClass} />
      <input type="number" min="0" placeholder="Electricity (kWh)" name="electricityKwh" value={form.electricityKwh} onChange={onChange} className={inputClass} />
      <input type="number" min="0" placeholder="Shopping (INR)" name="shoppingSpend" value={form.shoppingSpend} onChange={onChange} className={inputClass} />
      <input type="number" min="0" placeholder="Food (kgCO2e)" name="foodKgCO2e" value={form.foodKgCO2e} onChange={onChange} className={inputClass} />

      {/* Additional Inputs */}
      <input type="number" min="0" placeholder="Flights (km)" name="flightsKm" value={form.flightsKm} onChange={onChange} className={inputClass} />
      <input type="number" min="0" placeholder="Water Usage (liters)" name="waterLiters" value={form.waterLiters} onChange={onChange} className={inputClass} />
      <input type="number" min="0" placeholder="Waste (kg)" name="wasteKg" value={form.wasteKg} onChange={onChange} className={inputClass} />

      <button disabled={loading} className={buttonClass}>
        {loading ? 'Saving...' : 'Log Emissions'}
      </button>
    </form>
  );
}
