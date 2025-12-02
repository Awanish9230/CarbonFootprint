// EmissionForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
    meat_kg: '',
    chicken_kg: '',
    vegetables_kg: ''
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    //Validation: prevent submission if all fields are empty
    const allEmpty = Object.values(form).every(v => v === '' || v === null);
    if (allEmpty) {
      toast.error('Please fill at least one field before submitting.', {
        position: "top-right",
        autoClose: 3000,
      });
      setLoading(false);
      return;
    }

    try {
      // Convert all values to numbers (empty fields become 0)
      const payload = Object.fromEntries(
        Object.entries(form).map(([k, v]) => [k, Number(v) || 0])
      );

      const res = await api.post('/emissions/log', payload);
      onLogged && onLogged(res.data);

      //Show success toast
      toast.success('Emissions logged successfully! Redirecting...', {
        position: "top-right",
        autoClose: 2000,
      });

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
        meat_kg: '',
        chicken_kg: '',
        vegetables_kg: ''
      });

      setTimeout(() => navigate('/dashboard'), 2000);

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to log emission.', {
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "px-4 py-2 rounded-lg bg-white text-gray-900 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-[#1a1a1a] dark:text-white dark:border-gray-700";

  const buttonClass =
    "col-span-1 sm:col-span-2 px-5 py-2 rounded-lg text-white font-medium transition disabled:opacity-50 " +
    "bg-[linear-gradient(159deg,#0892d0,#4b0082)] hover:opacity-90";

  return (
    <div>
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
        {/* <input type="number" placeholder="Meat (kg)" name="beef_kg" value={form.beef_kg} onChange={onChange} className={inputClass} /> */}
        <input type="number" placeholder="Meat (kg)" name="meat_kg" value={form.meat_kg} onChange={onChange} className={inputClass} />
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

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}
