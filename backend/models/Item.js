import mongoose from "mongoose";

const alternativeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  carbon: { type: Number, required: true }, // kg CO2e
});

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  unit: { type: String, required: true },
  carbon: { type: Number, required: true }, 
  notes: { type: String },
  alternatives: [alternativeSchema], 
});

const Item = mongoose.model("Item", itemSchema);
export default Item;
