import mongoose from 'mongoose';

const emissionFactorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    category: { type: String, required: true },
    unit: { type: String, required: true },
    factor: { type: Number, required: true } // kgCO2e per unit
  },
  { timestamps: true }
);

export default mongoose.model('EmissionFactor', emissionFactorSchema);
