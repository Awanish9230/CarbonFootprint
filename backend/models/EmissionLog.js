// emissionLog.js
import mongoose from 'mongoose';

const breakdownSchema = new mongoose.Schema(
  {
    vehicle_km: { type: Number, default: 0 },
    electricity_kwh: { type: Number, default: 0 },
    shopping_inr: { type: Number, default: 0 },
    food_kgco2e: { type: Number, default: 0 },
    lpg_kg: { type: Number, default: 0 },
    rail_km: { type : Number, default: 0 },
    bus_km: { type: Number, default: 0 },
    cycle_km: { type: Number, default: 0 },
    meat_kg: { type: Number, default: 0 },
    chicken_kg: { type: Number, default: 0 },
    vegetables_kg: { type: Number, default: 0 },
    flights_km: { type: Number, default: 0 },
    water_liters: { type: Number, default: 0 },
    waste_kg: { type: Number, default: 0 },
    // optional “other” if you want to allow extras
    other: { type: Number, default: 0 },
  },
  { _id: false }
);

const emissionLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now },
    totalCO2: { type: Number, required: true },
    breakdown: { type: breakdownSchema, default: () => ({}) }
  },
  { timestamps: true }
);

export default mongoose.model('EmissionLog', emissionLogSchema);
