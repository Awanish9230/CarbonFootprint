import mongoose from 'mongoose';

const badgeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    criteria: {
      type: {
        type: String,
        enum: ['cycling_km', 'vegetarian_days', 'energy_savings', 'custom'],
        default: 'custom'
      },
      threshold: { type: Number, default: 0 },
      unit: { type: String, default: '' }
    },
    icon: { type: String, default: '' }
  },
  { timestamps: true }
);

export default mongoose.model('Badge', badgeSchema);
