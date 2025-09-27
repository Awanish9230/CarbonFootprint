const mongoose = require('mongoose');

const emissionFactorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    category: { type: String, required: true },
    unit: { type: String, required: true },
    factor: { type: Number, required: true } // kgCO2e per unit
  },
  { timestamps: true }
);

module.exports = mongoose.model('EmissionFactor', emissionFactorSchema);
