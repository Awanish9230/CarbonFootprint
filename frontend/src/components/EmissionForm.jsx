// EmissionForm.jsx
import React, { useState } from 'react';
import api from '../api/axios';

export default function EmissionForm({ onLogged }) {
  const [form, setForm] = useState({
    vehicle_km: '',
    electricity_kwh: '',
    shopping_inr: '',
    food_kgco2e: '',
    flights_km: '',
    water_liters: '',
    waste_kg: '',
    lpg_kg: '',
    rail_km: '',
    bus_km: '',
    cycle_km: '',
    beef_kg: '',
    chicken_kg: '',
    vegetables_kg: ''
  });

  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convert all values to numbers
      const payload = Object.fromEntries(
        Object.entries(form).map(([k, v]) => [k, Number(v) || 0])
      );

      console.log('Submitting payload:', payload);

      const res = await api.post('/emissions/log', payload);
      onLogged && onLogged(res.data);

      // Reset form
      setForm({
        vehicle_km: '',
        electricity_kwh: '',
        shopping_inr: '',
        food_kgco2e: '',
        flights_km: '',
        water_liters: '',
        waste_kg: '',
        lpg_kg: '',
        rail_km: '',
        bus_km: '',
        cycle_km: '',
        beef_kg: '',
        chicken_kg: '',
        vegetables_kg: ''
      });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to log emission.');
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
      {/* Transport */}
      <input type="number" placeholder="Vehicle (km)" name="vehicle_km" value={form.vehicle_km} onChange={onChange} className={inputClass} />
      <input type="number" placeholder="Rail (km)" name="rail_km" value={form.rail_km} onChange={onChange} className={inputClass} />
      <input type="number" placeholder="Bus (km)" name="bus_km" value={form.bus_km} onChange={onChange} className={inputClass} />
      <input type="number" placeholder="Cycle (km)" name="cycle_km" value={form.cycle_km} onChange={onChange} className={inputClass} />
      <input type="number" placeholder="Flights (km)" name="flights_km" value={form.flights_km} onChange={onChange} className={inputClass} />

      {/* Energy */}
      <input type="number" placeholder="Electricity (kWh)" name="electricity_kwh" value={form.electricity_kwh} onChange={onChange} className={inputClass} />
      <input type="number" placeholder="LPG (kg)" name="lpg_kg" value={form.lpg_kg} onChange={onChange} className={inputClass} />

      {/* Food */}
      <input type="number" placeholder="Beef (kg)" name="beef_kg" value={form.beef_kg} onChange={onChange} className={inputClass} />
      <input type="number" placeholder="Chicken (kg)" name="chicken_kg" value={form.chicken_kg} onChange={onChange} className={inputClass} />
      <input type="number" placeholder="Vegetables (kg)" name="vegetables_kg" value={form.vegetables_kg} onChange={onChange} className={inputClass} />
      <input type="number" placeholder="Food (kgCO₂e)" name="food_kgco2e" value={form.food_kgco2e} onChange={onChange} className={inputClass} />

      {/* Miscellaneous */}
      <input type="number" placeholder="Shopping (INR)" name="shopping_inr" value={form.shopping_inr} onChange={onChange} className={inputClass} />
      <input type="number" placeholder="Water Usage (liters)" name="water_liters" value={form.water_liters} onChange={onChange} className={inputClass} />
      <input type="number" placeholder="Waste (kg)" name="waste_kg" value={form.waste_kg} onChange={onChange} className={inputClass} />

      <button disabled={loading} className={buttonClass}>
        {loading ? 'Saving...' : 'Log Emissions'}
      </button>
    </form>
  );
}
