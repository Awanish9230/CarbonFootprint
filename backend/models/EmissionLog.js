const mongoose = require('mongoose');

const breakdownSchema = new mongoose.Schema(
  {
    vehicleKm: { type: Number, default: 0 },
    electricityKwh: { type: Number, default: 0 },
    shoppingSpend: { type: Number, default: 0 },
    foodKgCO2e: { type: Number, default: 0 },
    other: { type: Number, default: 0 }
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

module.exports = mongoose.model('EmissionLog', emissionLogSchema);
