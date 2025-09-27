import React, { useState } from 'react';
import api from '../api/axios';

export default function EmissionForm({ onLogged }) {
  const [form, setForm] = useState({ vehicleKm: '', electricityKwh: '', shoppingSpend: '', foodKgCO2e: '' });
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, Number(v) || 0]));
      const res = await api.post('/emissions/log', payload);
      onLogged && onLogged(res.data);
      setForm({ vehicleKm: '', electricityKwh: '', shoppingSpend: '', foodKgCO2e: '' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <input className="input" placeholder="Vehicle (km)" name="vehicleKm" value={form.vehicleKm} onChange={onChange} />
      <input className="input" placeholder="Electricity (kWh)" name="electricityKwh" value={form.electricityKwh} onChange={onChange} />
      <input className="input" placeholder="Shopping (INR)" name="shoppingSpend" value={form.shoppingSpend} onChange={onChange} />
      <input className="input" placeholder="Food (kgCO2e)" name="foodKgCO2e" value={form.foodKgCO2e} onChange={onChange} />
      <button disabled={loading} className="col-span-1 sm:col-span-2 px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700">
        {loading ? 'Saving...' : 'Log Emissions'}
      </button>
    </form>
  );
}
