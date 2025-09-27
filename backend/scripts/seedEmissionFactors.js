const mongoose = require('mongoose');
const dotenv = require('dotenv');
const EmissionFactor = require('../models/EmissionFactor');
const factors = require('../utils/emissionFactors');

dotenv.config();

async function run() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/carbon_footprint_tracker';
  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  for (const f of factors) {
    await EmissionFactor.findOneAndUpdate(
      { name: f.name },
      { $set: f },
      { upsert: true, new: true }
    );
    console.log('Upserted', f.name);
  }

  await mongoose.disconnect();
  console.log('Seeding complete');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
