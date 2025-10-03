import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Item from '../models/Item.js';

dotenv.config();

const items = [
  // ===================== Stationery =====================
  { name: 'Ballpoint Pen', category: 'Stationery', unit: 'unit', carbon: 0.02, alternatives: [{ name: 'Refillable Pen', carbon: 0.01 }, { name: 'Pencil', carbon: 0.01 }, { name: 'Digital Note App', carbon: 0 }] },
  { name: 'Refillable Pen', category: 'Stationery', unit: 'unit', carbon: 0.01, alternatives: [{ name: 'Pencil', carbon: 0.01 }, { name: 'Digital Note App', carbon: 0 }, { name: 'Eco Pen', carbon: 0.005 }] },
  { name: 'Notebook (A4, 50 pages)', category: 'Stationery', unit: 'unit', carbon: 0.5, alternatives: [{ name: 'Recycled Notebook', carbon: 0.3 }, { name: 'Digital Note App', carbon: 0 }, { name: 'E-notebook', carbon: 0 }] },
  { name: 'Copy Paper (A4, 500 sheets)', category: 'Stationery', unit: 'ream', carbon: 2.3, alternatives: [{ name: 'Recycled Paper', carbon: 1.2 }, { name: 'Digital File', carbon: 0 }, { name: 'Paperless Notebook', carbon: 0 }] },
  { name: 'Pencil', category: 'Stationery', unit: 'unit', carbon: 0.01, alternatives: [{ name: 'Recycled Pencil', carbon: 0.005 }, { name: 'Mechanical Pencil', carbon: 0.008 }, { name: 'Digital Note App', carbon: 0 }] },
  { name: 'Eraser', category: 'Stationery', unit: 'unit', carbon: 0.005, alternatives: [{ name: 'Recycled Eraser', carbon: 0.003 }, { name: 'Digital Correction', carbon: 0 }, { name: 'Clay Eraser', carbon: 0.004 }] },
  { name: 'Highlighter', category: 'Stationery', unit: 'unit', carbon: 0.02, alternatives: [{ name: 'Water-based Highlighter', carbon: 0.01 }, { name: 'Digital Highlight', carbon: 0 }, { name: 'Reusable Marker', carbon: 0.008 }] },
  { name: 'Sticky Notes', category: 'Stationery', unit: 'pack', carbon: 0.3, alternatives: [{ name: 'Digital Notes', carbon: 0 }, { name: 'Recycled Sticky Notes', carbon: 0.1 }, { name: 'Reusable Boards', carbon: 0.05 }] },
  { name: 'Marker Pen', category: 'Stationery', unit: 'unit', carbon: 0.03, alternatives: [{ name: 'Refillable Marker', carbon: 0.01 }, { name: 'Digital Marker', carbon: 0 }, { name: 'Water-based Marker', carbon: 0.02 }] },
  { name: 'Sketchbook', category: 'Stationery', unit: 'unit', carbon: 0.6, alternatives: [{ name: 'Digital Sketch App', carbon: 0 }, { name: 'Recycled Sketchbook', carbon: 0.3 }, { name: 'E-notebook', carbon: 0 }] },
  { name: 'Art Paper Pack', category: 'Stationery', unit: 'pack', carbon: 0.8, alternatives: [{ name: 'Recycled Art Paper', carbon: 0.4 }, { name: 'Digital Drawing App', carbon: 0 }, { name: 'Canvas', carbon: 0.5 }] },
  { name: 'Erasable Pen', category: 'Stationery', unit: 'unit', carbon: 0.015, alternatives: [{ name: 'Pencil', carbon: 0.01 }, { name: 'Digital Note App', carbon: 0 }, { name: 'Refillable Pen', carbon: 0.01 }] },
  { name: 'Watercolor Set', category: 'Stationery', unit: 'set', carbon: 0.9, alternatives: [{ name: 'Eco Paints', carbon: 0.5 }, { name: 'Digital Painting App', carbon: 0 }, { name: 'Non-toxic Watercolors', carbon: 0.6 }] },
  { name: 'Colored Pencils', category: 'Stationery', unit: 'set', carbon: 0.2, alternatives: [{ name: 'Recycled Colored Pencils', carbon: 0.1 }, { name: 'Digital Art App', carbon: 0 }, { name: 'Watercolor Pencils', carbon: 0.15 }] },
  { name: 'Glue Stick', category: 'Stationery', unit: 'unit', carbon: 0.05, alternatives: [{ name: 'Eco Glue', carbon: 0.02 }, { name: 'Water-based Adhesive', carbon: 0.03 }, { name: 'Digital Document Merge', carbon: 0 }] },
  { name: 'Scissors', category: 'Stationery', unit: 'unit', carbon: 0.2, alternatives: [{ name: 'Recycled Metal Scissors', carbon: 0.1 }, { name: 'Safety Cutter', carbon: 0.05 }, { name: 'Paper Cutter', carbon: 0.1 }] },
  { name: 'Ruler', category: 'Stationery', unit: 'unit', carbon: 0.05, alternatives: [{ name: 'Recycled Plastic Ruler', carbon: 0.03 }, { name: 'Metal Ruler', carbon: 0.02 }, { name: 'Digital Measurement App', carbon: 0 }] },
  { name: 'Stapler', category: 'Stationery', unit: 'unit', carbon: 0.3, alternatives: [{ name: 'Eco Stapler', carbon: 0.15 }, { name: 'Electric Stapler', carbon: 0.2 }, { name: 'Paper Clips', carbon: 0.05 }] },
  { name: 'Staples', category: 'Stationery', unit: 'box', carbon: 0.1, alternatives: [{ name: 'Recycled Staples', carbon: 0.05 }, { name: 'Binder Clips', carbon: 0.02 }, { name: 'Digital File', carbon: 0 }] },
  { name: 'Binder', category: 'Stationery', unit: 'unit', carbon: 0.4, alternatives: [{ name: 'Recycled Binder', carbon: 0.2 }, { name: 'Digital Folder', carbon: 0 }, { name: 'Cardboard Binder', carbon: 0.1 }] },
  { name: 'File Folder', category: 'Stationery', unit: 'unit', carbon: 0.15, alternatives: [{ name: 'Recycled Folder', carbon: 0.08 }, { name: 'Digital Folder', carbon: 0 }, { name: 'Cardboard Folder', carbon: 0.05 }] },

  // ===================== Electronics =====================
  { name: 'Desk Lamp (LED)', category: 'Electronics', unit: 'kWh', carbon: 0.5, alternatives: [{ name: 'Solar Desk Lamp', carbon: 0.01 }, { name: 'CFL Lamp', carbon: 0.08 }, { name: 'Rechargeable LED Lamp', carbon: 0.03 }] },
  { name: 'Ceiling Fan', category: 'Electronics', unit: 'kWh', carbon: 0.5, alternatives: [{ name: 'Energy Star Fan', carbon: 0.3 }, { name: 'Solar Fan', carbon: 0.1 }, { name: 'DC Motor Fan', carbon: 0.25 }] },
  { name: 'Air Conditioner (split)', category: 'Appliance', unit: 'kWh', carbon: 0.5, alternatives: [{ name: 'Inverter AC', carbon: 0.3 }, { name: 'Evaporative Cooler', carbon: 0.1 }, { name: 'Solar AC', carbon: 0.2 }] },
  { name: 'Refrigerator', category: 'Appliance', unit: 'unit', carbon: 50, alternatives: [{ name: 'Energy Star Fridge', carbon: 35 }, { name: 'Solar-powered Fridge', carbon: 20 }, { name: 'Mini Fridge', carbon: 15 }] },
  { name: 'Laptop (15")', category: 'Electronics', unit: 'unit', carbon: 200, alternatives: [{ name: 'Energy-efficient Laptop', carbon: 150 }, { name: 'Refurbished Laptop', carbon: 50 }, { name: 'Tablet', carbon: 50 }] },
  { name: 'Smartphone', category: 'Electronics', unit: 'unit', carbon: 70, alternatives: [{ name: 'Refurbished Smartphone', carbon: 30 }, { name: 'Basic Phone', carbon: 10 }, { name: 'Tablet', carbon: 50 }] },
  { name: 'Tablet', category: 'Electronics', unit: 'unit', carbon: 50, alternatives: [{ name: 'Refurbished Tablet', carbon: 25 }, { name: 'E-reader', carbon: 15 }, { name: 'Digital Note App', carbon: 0 }] },
  { name: 'Desktop PC', category: 'Electronics', unit: 'unit', carbon: 400, alternatives: [{ name: 'Mini PC', carbon: 100 }, { name: 'Refurbished PC', carbon: 80 }, { name: 'Laptop', carbon: 200 }] },
  { name: 'Printer (laser)', category: 'Electronics', unit: 'unit', carbon: 40, alternatives: [{ name: 'Printer (inkjet)', carbon: 20 }, { name: 'Digital File', carbon: 0 }, { name: 'Shared Printer', carbon: 10 }] },
  { name: 'Ink Cartridge (printer)', category: 'Stationery', unit: 'unit', carbon: 0.6, alternatives: [{ name: 'Refilled Cartridge', carbon: 0.2 }, { name: 'Digital Document', carbon: 0 }, { name: 'Eco Ink', carbon: 0.1 }] },
  { name: 'Laptop Charger', category: 'Electronics', unit: 'unit', carbon: 2.0, alternatives: [{ name: 'Shared Charger', carbon: 0.5 }, { name: 'Energy-efficient Charger', carbon: 1 }, { name: 'Solar Charger', carbon: 0.2 }] },
  { name: 'Power Bank', category: 'Electronics', unit: 'unit', carbon: 6.0, alternatives: [{ name: 'Shared Power Bank', carbon: 2 }, { name: 'Solar Power Bank', carbon: 0.5 }, { name: 'High-efficiency Battery', carbon: 1 }] },

  // ===================== Appliances =====================
  { name: 'Washing Machine', category: 'Appliance', unit: 'unit', carbon: 30, alternatives: [{ name: 'Front-load Machine', carbon: 20 }, { name: 'Hand Wash', carbon: 5 }, { name: 'Solar-powered Washer', carbon: 10 }] },
  { name: 'Microwave Oven', category: 'Appliance', unit: 'unit', carbon: 15, alternatives: [{ name: 'Convection Oven', carbon: 10 }, { name: 'Solar Oven', carbon: 5 }, { name: 'Stove', carbon: 3 }] },
  { name: 'Electric Kettle', category: 'Appliance', unit: 'unit', carbon: 0.4, alternatives: [{ name: 'Stove Kettle', carbon: 0.1 }, { name: 'Solar Kettle', carbon: 0.05 }, { name: 'Thermos', carbon: 0 }] },
  { name: 'Dishwasher', category: 'Appliance', unit: 'cycle', carbon: 0.7, alternatives: [{ name: 'Hand Wash', carbon: 0.2 }, { name: 'Energy-efficient Dishwasher', carbon: 0.4 }, { name: 'Solar Hot Water Wash', carbon: 0.1 }] },
  { name: 'Toaster', category: 'Appliance', unit: 'unit', carbon: 0.5, alternatives: [{ name: 'Energy-efficient Toaster', carbon: 0.3 }, { name: 'Stove Toast', carbon: 0.1 }, { name: 'Solar Oven Toast', carbon: 0.05 }] },
  { name: 'Coffee Maker', category: 'Appliance', unit: 'unit', carbon: 1, alternatives: [{ name: 'French Press', carbon: 0.2 }, { name: 'Solar Coffee Brewer', carbon: 0.05 }, { name: 'Manual Pour-over', carbon: 0.1 }] },

  // ===================== Transport =====================
  { name: 'Bus (per km)', category: 'Transport', unit: 'km', carbon: 0.08, alternatives: [{ name: 'Train (per km)', carbon: 0.04 }, { name: 'Bicycle', carbon: 0 }, { name: 'Walking', carbon: 0 }] },
  { name: 'Car (petrol) per km', category: 'Transport', unit: 'km', carbon: 0.192, alternatives: [{ name: 'Car (electric) per km', carbon: 0.08 }, { name: 'Carpool', carbon: 0.05 }, { name: 'Public Transport', carbon: 0.04 }] },
  { name: 'Car (diesel) per km', category: 'Transport', unit: 'km', carbon: 0.171, alternatives: [{ name: 'Car (electric) per km', carbon: 0.08 }, { name: 'Carpool', carbon: 0.05 }, { name: 'Bus', carbon: 0.08 }] },
  { name: 'Motorbike per km', category: 'Transport', unit: 'km', carbon: 0.08, alternatives: [{ name: 'Bicycle', carbon: 0 }, { name: 'Walking', carbon: 0 }, { name: 'Electric Scooter', carbon: 0.02 }] },
  { name: 'Train (per km)', category: 'Transport', unit: 'km', carbon: 0.041, alternatives: [{ name: 'Bus', carbon: 0.08 }, { name: 'Bicycle', carbon: 0 }, { name: 'Walking', carbon: 0 }] },
  { name: 'Taxi ride (per km)', category: 'Transport', unit: 'km', carbon: 0.2, alternatives: [{ name: 'Uber Pool', carbon: 0.12 }, { name: 'Public Transport', carbon: 0.04 }, { name: 'Bicycle', carbon: 0 }] },
  { name: 'Bicycle (per km)', category: 'Transport', unit: 'km', carbon: 0.0, alternatives: [{ name: 'Walking', carbon: 0 }, { name: 'Electric Scooter', carbon: 0.01 }, { name: 'Public Transport', carbon: 0.04 }] },
  { name: 'Walking (per km)', category: 'Transport', unit: 'km', carbon: 0.0, alternatives: [{ name: 'Bicycle', carbon: 0 }, { name: 'Electric Scooter', carbon: 0.01 }, { name: 'Public Transport', carbon: 0.04 }] },

  // ===================== Food =====================
  { name: 'Chicken (1 kg)', category: 'Food', unit: 'kg', carbon: 6.9, alternatives: [{ name: 'Vegetables', carbon: 2 }, { name: 'Lentils', carbon: 1.5 }, { name: 'Tofu', carbon: 2 }] },
  { name: 'Pork (1 kg)', category: 'Food', unit: 'kg', carbon: 12.1, alternatives: [{ name: 'Vegetables', carbon: 2 }, { name: 'Lentils', carbon: 1.5 }, { name: 'Tofu', carbon: 2 }] },
  { name: 'Fish (1 kg)', category: 'Food', unit: 'kg', carbon: 6.1, alternatives: [{ name: 'Vegetables', carbon: 2 }, { name: 'Lentils', carbon: 1.5 }, { name: 'Tofu', carbon: 2 }] },
  { name: 'Vegetables (1 kg)', category: 'Food', unit: 'kg', carbon: 2.0, alternatives: [{ name: 'Organic Vegetables', carbon: 1.5 }, { name: 'Local Vegetables', carbon: 1.2 }, { name: 'Seasonal Vegetables', carbon: 1.3 }] },
  { name: 'Fruits (1 kg)', category: 'Food', unit: 'kg', carbon: 1.1, alternatives: [{ name: 'Organic Fruits', carbon: 0.8 }, { name: 'Local Fruits', carbon: 0.7 }, { name: 'Seasonal Fruits', carbon: 0.9 }] },
  { name: 'Milk (1 liter)', category: 'Food', unit: 'liter', carbon: 1.9, alternatives: [{ name: 'Soy Milk', carbon: 0.5 }, { name: 'Oat Milk', carbon: 0.6 }, { name: 'Almond Milk', carbon: 0.7 }] },
  { name: 'Egg (1)', category: 'Food', unit: 'unit', carbon: 0.4, alternatives: [{ name: 'Tofu', carbon: 0.1 }, { name: 'Lentils', carbon: 0.05 }, { name: 'Chickpeas', carbon: 0.05 }] },
  { name: 'Bread (1 loaf)', category: 'Food', unit: 'loaf', carbon: 0.5, alternatives: [{ name: 'Whole Grain Bread', carbon: 0.3 }, { name: 'Gluten-free Bread', carbon: 0.25 }, { name: 'Sourdough Bread', carbon: 0.35 }] },
  { name: 'Rice (1 kg)', category: 'Food', unit: 'kg', carbon: 2.7, alternatives: [{ name: 'Brown Rice', carbon: 2 }, { name: 'Local Rice', carbon: 2.2 }, { name: 'Organic Rice', carbon: 1.8 }] },
  // ===================== Food continued =====================
  { name: 'Cheese (1 kg)', category: 'Food', unit: 'kg', carbon: 13.5, alternatives: [{ name: 'Vegan Cheese', carbon: 4 }, { name: 'Low-fat Cheese', carbon: 8 }, { name: 'Plant-based Cheese', carbon: 5 }] },
  { name: 'Butter (1 kg)', category: 'Food', unit: 'kg', carbon: 24, alternatives: [{ name: 'Margarine', carbon: 7 }, { name: 'Plant-based Butter', carbon: 6 }, { name: 'Olive Oil', carbon: 5 }] },
  { name: 'Sugar (1 kg)', category: 'Food', unit: 'kg', carbon: 2.6, alternatives: [{ name: 'Coconut Sugar', carbon: 1.5 }, { name: 'Stevia', carbon: 0 }, { name: 'Date Sugar', carbon: 1.2 }] },
  { name: 'Salt (1 kg)', category: 'Food', unit: 'kg', carbon: 0.5, alternatives: [{ name: 'Sea Salt', carbon: 0.3 }, { name: 'Rock Salt', carbon: 0.2 }, { name: 'Himalayan Salt', carbon: 0.25 }] },
  { name: 'Coffee (1 cup, brewed)', category: 'Food', unit: 'cup', carbon: 0.08, alternatives: [{ name: 'Instant Coffee', carbon: 0.05 }, { name: 'Tea', carbon: 0.02 }, { name: 'Herbal Tea', carbon: 0.01 }] },
  { name: 'Tea (1 cup, brewed)', category: 'Food', unit: 'cup', carbon: 0.02, alternatives: [{ name: 'Herbal Tea', carbon: 0.01 }, { name: 'Green Tea', carbon: 0.015 }, { name: 'Loose Leaf Tea', carbon: 0.018 }] },
  { name: 'Yogurt (1 cup)', category: 'Food', unit: 'cup', carbon: 1.2, alternatives: [{ name: 'Soy Yogurt', carbon: 0.5 }, { name: 'Almond Yogurt', carbon: 0.4 }, { name: 'Coconut Yogurt', carbon: 0.3 }] },
  { name: 'Ice Cream (100g)', category: 'Food', unit: 'unit', carbon: 3.0, alternatives: [{ name: 'Sorbet', carbon: 1.0 }, { name: 'Vegan Ice Cream', carbon: 1.2 }, { name: 'Frozen Yogurt', carbon: 1.5 }] },
  { name: 'Chocolate (100g)', category: 'Food', unit: 'unit', carbon: 2.5, alternatives: [{ name: 'Dark Chocolate', carbon: 2.0 }, { name: 'Organic Chocolate', carbon: 1.8 }, { name: 'Vegan Chocolate', carbon: 1.5 }] },
  { name: 'Peanut Butter (1 jar)', category: 'Food', unit: 'unit', carbon: 4.0, alternatives: [{ name: 'Almond Butter', carbon: 3.0 }, { name: 'Cashew Butter', carbon: 3.5 }, { name: 'Sunflower Butter', carbon: 2.5 }] },
  { name: 'Jam (1 jar)', category: 'Food', unit: 'unit', carbon: 2.0, alternatives: [{ name: 'Honey', carbon: 1.5 }, { name: 'Fruit Spread', carbon: 1.2 }, { name: 'Natural Jam', carbon: 1.8 }] },
  { name: 'Olive Oil (1 liter)', category: 'Food', unit: 'liter', carbon: 6.0, alternatives: [{ name: 'Sunflower Oil', carbon: 4.0 }, { name: 'Coconut Oil', carbon: 5.0 }, { name: 'Avocado Oil', carbon: 3.5 }] },
  { name: 'Vegetable Oil (1 liter)', category: 'Food', unit: 'liter', carbon: 5.0, alternatives: [{ name: 'Canola Oil', carbon: 4.0 }, { name: 'Sunflower Oil', carbon: 3.5 }, { name: 'Olive Oil', carbon: 6.0 }] },
  { name: 'Tomato (1 kg)', category: 'Food', unit: 'kg', carbon: 1.2, alternatives: [{ name: 'Local Tomatoes', carbon: 1.0 }, { name: 'Organic Tomatoes', carbon: 0.8 }, { name: 'Seasonal Tomatoes', carbon: 0.9 }] },
  { name: 'Potato (1 kg)', category: 'Food', unit: 'kg', carbon: 0.6, alternatives: [{ name: 'Organic Potatoes', carbon: 0.5 }, { name: 'Local Potatoes', carbon: 0.4 }, { name: 'Sweet Potato', carbon: 0.5 }] },
  { name: 'Onion (1 kg)', category: 'Food', unit: 'kg', carbon: 0.5, alternatives: [{ name: 'Organic Onion', carbon: 0.4 }, { name: 'Local Onion', carbon: 0.35 }, { name: 'Shallots', carbon: 0.4 }] },
  { name: 'Garlic (1 kg)', category: 'Food', unit: 'kg', carbon: 0.8, alternatives: [{ name: 'Organic Garlic', carbon: 0.6 }, { name: 'Local Garlic', carbon: 0.5 }, { name: 'Shallots', carbon: 0.6 }] },
  { name: 'Carrot (1 kg)', category: 'Food', unit: 'kg', carbon: 0.3, alternatives: [{ name: 'Organic Carrot', carbon: 0.25 }, { name: 'Local Carrot', carbon: 0.2 }, { name: 'Baby Carrot', carbon: 0.2 }] },
  { name: 'Cucumber (1 kg)', category: 'Food', unit: 'kg', carbon: 0.2, alternatives: [{ name: 'Organic Cucumber', carbon: 0.15 }, { name: 'Local Cucumber', carbon: 0.1 }, { name: 'Pickling Cucumber', carbon: 0.18 }] },
  { name: 'Bell Pepper (1 kg)', category: 'Food', unit: 'kg', carbon: 0.9, alternatives: [{ name: 'Organic Bell Pepper', carbon: 0.6 }, { name: 'Local Bell Pepper', carbon: 0.5 }, { name: 'Green Bell Pepper', carbon: 0.5 }] },
  { name: 'Spinach (1 kg)', category: 'Food', unit: 'kg', carbon: 0.4, alternatives: [{ name: 'Organic Spinach', carbon: 0.3 }, { name: 'Local Spinach', carbon: 0.25 }, { name: 'Kale', carbon: 0.35 }] },
  { name: 'Lettuce (1 kg)', category: 'Food', unit: 'kg', carbon: 0.3, alternatives: [{ name: 'Organic Lettuce', carbon: 0.25 }, { name: 'Local Lettuce', carbon: 0.2 }, { name: 'Romaine Lettuce', carbon: 0.25 }] },
  { name: 'Cabbage (1 kg)', category: 'Food', unit: 'kg', carbon: 0.5, alternatives: [{ name: 'Organic Cabbage', carbon: 0.4 }, { name: 'Local Cabbage', carbon: 0.35 }, { name: 'Savoy Cabbage', carbon: 0.38 }] },
  { name: 'Broccoli (1 kg)', category: 'Food', unit: 'kg', carbon: 0.7, alternatives: [{ name: 'Organic Broccoli', carbon: 0.5 }, { name: 'Local Broccoli', carbon: 0.45 }, { name: 'Cauliflower', carbon: 0.5 }] },
  { name: 'Cauliflower (1 kg)', category: 'Food', unit: 'kg', carbon: 0.6, alternatives: [{ name: 'Organic Cauliflower', carbon: 0.4 }, { name: 'Local Cauliflower', carbon: 0.35 }, { name: 'Broccoli', carbon: 0.5 }] },
  { name: 'Green Beans (1 kg)', category: 'Food', unit: 'kg', carbon: 0.3, alternatives: [{ name: 'Organic Green Beans', carbon: 0.25 }, { name: 'Local Green Beans', carbon: 0.2 }, { name: 'Snap Beans', carbon: 0.22 }] },
  { name: 'Peas (1 kg)', category: 'Food', unit: 'kg', carbon: 0.4, alternatives: [{ name: 'Organic Peas', carbon: 0.3 }, { name: 'Local Peas', carbon: 0.25 }, { name: 'Chickpeas', carbon: 0.2 }] },
  { name: 'Lentils (1 kg)', category: 'Food', unit: 'kg', carbon: 0.9, alternatives: [{ name: 'Organic Lentils', carbon: 0.7 }, { name: 'Local Lentils', carbon: 0.6 }, { name: 'Chickpeas', carbon: 0.5 }] },
  { name: 'Chickpeas (1 kg)', category: 'Food', unit: 'kg', carbon: 0.7, alternatives: [{ name: 'Organic Chickpeas', carbon: 0.5 }, { name: 'Lentils', carbon: 0.5 }, { name: 'Beans', carbon: 0.6 }] },

  // ===================== Food continued =====================
  { name: 'Almonds (1 kg)', category: 'Food', unit: 'kg', carbon: 2.3, alternatives: [{ name: 'Cashews', carbon: 2.0 }, { name: 'Walnuts', carbon: 2.1 }, { name: 'Peanuts', carbon: 1.5 }] },
  { name: 'Cashews (1 kg)', category: 'Food', unit: 'kg', carbon: 2.5, alternatives: [{ name: 'Almonds', carbon: 2.3 }, { name: 'Peanuts', carbon: 1.5 }, { name: 'Walnuts', carbon: 2.1 }] },
  { name: 'Walnuts (1 kg)', category: 'Food', unit: 'kg', carbon: 2.8, alternatives: [{ name: 'Almonds', carbon: 2.3 }, { name: 'Cashews', carbon: 2.5 }, { name: 'Peanuts', carbon: 1.5 }] },
  { name: 'Peanuts (1 kg)', category: 'Food', unit: 'kg', carbon: 1.5, alternatives: [{ name: 'Almonds', carbon: 2.3 }, { name: 'Cashews', carbon: 2.5 }, { name: 'Walnuts', carbon: 2.8 }] },
  { name: 'Sunflower Seeds (1 kg)', category: 'Food', unit: 'kg', carbon: 1.0, alternatives: [{ name: 'Pumpkin Seeds', carbon: 1.2 }, { name: 'Chia Seeds', carbon: 0.8 }, { name: 'Flax Seeds', carbon: 0.7 }] },
  { name: 'Pumpkin Seeds (1 kg)', category: 'Food', unit: 'kg', carbon: 1.2, alternatives: [{ name: 'Sunflower Seeds', carbon: 1.0 }, { name: 'Chia Seeds', carbon: 0.8 }, { name: 'Flax Seeds', carbon: 0.7 }] },
  { name: 'Chia Seeds (1 kg)', category: 'Food', unit: 'kg', carbon: 0.8, alternatives: [{ name: 'Flax Seeds', carbon: 0.7 }, { name: 'Sunflower Seeds', carbon: 1.0 }, { name: 'Pumpkin Seeds', carbon: 1.2 }] },
  { name: 'Flax Seeds (1 kg)', category: 'Food', unit: 'kg', carbon: 0.7, alternatives: [{ name: 'Chia Seeds', carbon: 0.8 }, { name: 'Sunflower Seeds', carbon: 1.0 }, { name: 'Pumpkin Seeds', carbon: 1.2 }] },
  { name: 'Coconut (1 kg)', category: 'Food', unit: 'kg', carbon: 1.5, alternatives: [{ name: 'Almonds', carbon: 2.3 }, { name: 'Soy', carbon: 1.0 }, { name: 'Oats', carbon: 0.5 }] },
  { name: 'Oats (1 kg)', category: 'Food', unit: 'kg', carbon: 0.5, alternatives: [{ name: 'Rice', carbon: 2.7 }, { name: 'Barley', carbon: 0.6 }, { name: 'Quinoa', carbon: 0.9 }] },
  { name: 'Barley (1 kg)', category: 'Food', unit: 'kg', carbon: 0.6, alternatives: [{ name: 'Oats', carbon: 0.5 }, { name: 'Wheat', carbon: 0.8 }, { name: 'Rye', carbon: 0.7 }] },
  { name: 'Wheat (1 kg)', category: 'Food', unit: 'kg', carbon: 0.8, alternatives: [{ name: 'Barley', carbon: 0.6 }, { name: 'Oats', carbon: 0.5 }, { name: 'Quinoa', carbon: 0.9 }] },
  { name: 'Quinoa (1 kg)', category: 'Food', unit: 'kg', carbon: 0.9, alternatives: [{ name: 'Oats', carbon: 0.5 }, { name: 'Wheat', carbon: 0.8 }, { name: 'Barley', carbon: 0.6 }] },
  { name: 'Soy (1 kg)', category: 'Food', unit: 'kg', carbon: 2.0, alternatives: [{ name: 'Tofu', carbon: 1.2 }, { name: 'Tempeh', carbon: 1.3 }, { name: 'Peas', carbon: 0.4 }] },
  { name: 'Tofu (1 kg)', category: 'Food', unit: 'kg', carbon: 1.2, alternatives: [{ name: 'Soy', carbon: 2.0 }, { name: 'Tempeh', carbon: 1.3 }, { name: 'Chickpeas', carbon: 0.7 }] },
  { name: 'Tempeh (1 kg)', category: 'Food', unit: 'kg', carbon: 1.3, alternatives: [{ name: 'Tofu', carbon: 1.2 }, { name: 'Soy', carbon: 2.0 }, { name: 'Chickpeas', carbon: 0.7 }] },
  { name: 'Bread (1 loaf)', category: 'Food', unit: 'loaf', carbon: 0.5, alternatives: [{ name: 'Whole Grain Bread', carbon: 0.4 }, { name: 'Gluten-free Bread', carbon: 0.6 }, { name: 'Sourdough Bread', carbon: 0.5 }] },
  { name: 'Bagel (1 unit)', category: 'Food', unit: 'unit', carbon: 0.7, alternatives: [{ name: 'Whole Grain Bagel', carbon: 0.6 }, { name: 'Sourdough Bagel', carbon: 0.65 }, { name: 'Gluten-free Bagel', carbon: 0.7 }] },
  { name: 'Croissant (1 unit)', category: 'Food', unit: 'unit', carbon: 1.2, alternatives: [{ name: 'Whole Wheat Croissant', carbon: 0.9 }, { name: 'Vegan Croissant', carbon: 0.8 }, { name: 'Sourdough Croissant', carbon: 1.0 }] },
  { name: 'Muffin (1 unit)', category: 'Food', unit: 'unit', carbon: 1.0, alternatives: [{ name: 'Whole Wheat Muffin', carbon: 0.8 }, { name: 'Vegan Muffin', carbon: 0.7 }, { name: 'Banana Muffin', carbon: 0.6 }] },

  // ===================== Beverages =====================
  { name: 'Milk (1 liter)', category: 'Food', unit: 'liter', carbon: 1.9, alternatives: [{ name: 'Soy Milk', carbon: 0.5 }, { name: 'Almond Milk', carbon: 0.3 }, { name: 'Oat Milk', carbon: 0.4 }] },
  { name: 'Juice (1 liter)', category: 'Food', unit: 'liter', carbon: 1.2, alternatives: [{ name: 'Fresh Juice', carbon: 0.8 }, { name: 'Smoothie', carbon: 0.6 }, { name: 'Plant-based Juice', carbon: 0.7 }] },
  { name: 'Soda (1 liter)', category: 'Food', unit: 'liter', carbon: 1.0, alternatives: [{ name: 'Sparkling Water', carbon: 0.1 }, { name: 'Fruit Water', carbon: 0.3 }, { name: 'Herbal Drink', carbon: 0.2 }] },
  { name: 'Beer (1 bottle, 330ml)', category: 'Beverages', unit: 'bottle', carbon: 0.6, alternatives: [{ name: 'Wine', carbon: 0.5 }, { name: 'Cider', carbon: 0.4 }, { name: 'Non-alcoholic Beer', carbon: 0.3 }] },
  { name: 'Wine (1 glass, 150ml)', category: 'Beverages', unit: 'glass', carbon: 0.5, alternatives: [{ name: 'Beer', carbon: 0.6 }, { name: 'Cider', carbon: 0.4 }, { name: 'Non-alcoholic Wine', carbon: 0.3 }] },
  { name: 'Cider (1 glass, 150ml)', category: 'Beverages', unit: 'glass', carbon: 0.4, alternatives: [{ name: 'Beer', carbon: 0.6 }, { name: 'Wine', carbon: 0.5 }, { name: 'Sparkling Water', carbon: 0.1 }] },
  { name: 'Coffee Beans (1 kg)', category: 'Food', unit: 'kg', carbon: 8.0, alternatives: [{ name: 'Instant Coffee', carbon: 5.0 }, { name: 'Green Coffee', carbon: 4.0 }, { name: 'Tea', carbon: 0.02 }] },
  { name: 'Tea Leaves (1 kg)', category: 'Food', unit: 'kg', carbon: 4.0, alternatives: [{ name: 'Herbal Tea', carbon: 0.01 }, { name: 'Green Tea', carbon: 0.015 }, { name: 'Loose Leaf Tea', carbon: 0.018 }] },

  // ===================== Household & Kitchen =====================
  { name: 'Vacuum Cleaner', category: 'Appliance', unit: 'unit', carbon: 25, alternatives: [{ name: 'Broom', carbon: 0.01 }, { name: 'Manual Sweeper', carbon: 0.02 }, { name: 'Robot Cleaner', carbon: 20 }] },
  { name: 'Blender', category: 'Appliance', unit: 'unit', carbon: 5, alternatives: [{ name: 'Hand Whisk', carbon: 0.01 }, { name: 'Manual Grinder', carbon: 0.02 }, { name: 'Food Processor', carbon: 6 }] },
  { name: 'Toaster', category: 'Appliance', unit: 'unit', carbon: 3, alternatives: [{ name: 'Microwave', carbon: 15 }, { name: 'Oven', carbon: 25 }, { name: 'Air Fryer', carbon: 12 }] },
  { name: 'Kettle', category: 'Appliance', unit: 'unit', carbon: 0.4, alternatives: [{ name: 'Stove', carbon: 1 }, { name: 'Solar Kettle', carbon: 0.05 }, { name: 'Thermos', carbon: 0.02 }] },
  { name: 'Dish Rack', category: 'Furniture', unit: 'unit', carbon: 2, alternatives: [{ name: 'Plastic Tray', carbon: 1 }, { name: 'Wooden Rack', carbon: 1.5 }, { name: 'Metal Rack', carbon: 2.2 }] },
  { name: 'Cutlery Set', category: 'Kitchen', unit: 'set', carbon: 4, alternatives: [{ name: 'Bamboo Cutlery', carbon: 1 }, { name: 'Recycled Steel', carbon: 2 }, { name: 'Plastic', carbon: 5 }] },
  { name: 'Glassware Set', category: 'Kitchen', unit: 'set', carbon: 6, alternatives: [{ name: 'Ceramic', carbon: 5 }, { name: 'Plastic', carbon: 2 }, { name: 'Stainless Steel', carbon: 4 }] },
  { name: 'Cooking Pan', category: 'Kitchen', unit: 'unit', carbon: 7, alternatives: [{ name: 'Non-stick Pan', carbon: 6 }, { name: 'Clay Pot', carbon: 3 }, { name: 'Cast Iron Pan', carbon: 10 }] },
  { name: 'Cooking Pot', category: 'Kitchen', unit: 'unit', carbon: 5, alternatives: [{ name: 'Pressure Cooker', carbon: 4 }, { name: 'Clay Pot', carbon: 3 }, { name: 'Steel Pot', carbon: 6 }] },
  { name: 'Water Filter', category: 'Kitchen', unit: 'unit', carbon: 8, alternatives: [{ name: 'Boiling Water', carbon: 0.1 }, { name: 'RO Filter', carbon: 12 }, { name: 'Gravity Filter', carbon: 4 }] },

  // ===================== Personal Care =====================
  { name: 'Hair Dryer', category: 'Personal Care', unit: 'unit', carbon: 3, alternatives: [{ name: 'Air Dry', carbon: 0 }, { name: 'Towel Dry', carbon: 0.01 }, { name: 'Solar Dryer', carbon: 0.02 }] },
  { name: 'Electric Shaver', category: 'Personal Care', unit: 'unit', carbon: 1.5, alternatives: [{ name: 'Manual Razor', carbon: 0.2 }, { name: 'Safety Razor', carbon: 0.1 }, { name: 'Laser Hair Removal', carbon: 5 }] },
  { name: 'Hair Brush', category: 'Personal Care', unit: 'unit', carbon: 0.05, alternatives: [{ name: 'Wooden Comb', carbon: 0.02 }, { name: 'Recycled Plastic Brush', carbon: 0.04 }, { name: 'Metal Comb', carbon: 0.06 }] },
  { name: 'Face Wash', category: 'Personal Care', unit: 'bottle', carbon: 0.2, alternatives: [{ name: 'Soap Bar', carbon: 0.05 }, { name: 'Natural Cleanser', carbon: 0.1 }, { name: 'DIY Wash', carbon: 0.01 }] },
  { name: 'Moisturizer', category: 'Personal Care', unit: 'bottle', carbon: 0.3, alternatives: [{ name: 'Aloe Vera Gel', carbon: 0.05 }, { name: 'Coconut Oil', carbon: 0.02 }, { name: 'DIY Lotion', carbon: 0.01 }] },
  { name: 'Perfume', category: 'Personal Care', unit: 'bottle', carbon: 1.0, alternatives: [{ name: 'Essential Oil', carbon: 0.1 }, { name: 'Body Spray', carbon: 0.3 }, { name: 'Natural Fragrance', carbon: 0.05 }] },
  { name: 'Deodorant Spray', category: 'Personal Care', unit: 'bottle', carbon: 0.5, alternatives: [{ name: 'Roll-on', carbon: 0.2 }, { name: 'Soap', carbon: 0.05 }, { name: 'Alum Stick', carbon: 0.01 }] },
  { name: 'Nail Polish', category: 'Personal Care', unit: 'bottle', carbon: 0.4, alternatives: [{ name: 'Eco Nail Polish', carbon: 0.1 }, { name: 'DIY Polish', carbon: 0.05 }, { name: 'No Polish', carbon: 0 }] },
  { name: 'Hair Gel', category: 'Personal Care', unit: 'tube', carbon: 0.3, alternatives: [{ name: 'Aloe Gel', carbon: 0.05 }, { name: 'Natural Clay', carbon: 0.02 }, { name: 'No Gel', carbon: 0 }] },
  { name: 'Sunscreen', category: 'Personal Care', unit: 'tube', carbon: 0.5, alternatives: [{ name: 'Natural Sunscreen', carbon: 0.1 }, { name: 'Protective Clothing', carbon: 0.02 }, { name: 'Shade', carbon: 0.01 }] },

  // ===================== Electronics =====================
  { name: 'Smartwatch', category: 'Electronics', unit: 'unit', carbon: 25, alternatives: [{ name: 'Analog Watch', carbon: 5 }, { name: 'Fitness Band', carbon: 10 }, { name: 'None', carbon: 0 }] },
  { name: 'Tablet', category: 'Electronics', unit: 'unit', carbon: 50, alternatives: [{ name: 'Laptop', carbon: 200 }, { name: 'E-reader', carbon: 10 }, { name: 'Smartphone', carbon: 70 }] },
  { name: 'Laptop', category: 'Electronics', unit: 'unit', carbon: 200, alternatives: [{ name: 'Refurbished Laptop', carbon: 150 }, { name: 'Tablet', carbon: 50 }, { name: 'Desktop PC', carbon: 400 }] },
  { name: 'Desktop PC', category: 'Electronics', unit: 'unit', carbon: 400, alternatives: [{ name: 'Refurbished PC', carbon: 300 }, { name: 'Laptop', carbon: 200 }, { name: 'Thin Client', carbon: 100 }] },
  { name: 'Monitor', category: 'Electronics', unit: 'unit', carbon: 50, alternatives: [{ name: 'Laptop Screen', carbon: 20 }, { name: 'Energy-efficient Monitor', carbon: 30 }, { name: 'Projector', carbon: 40 }] },
  { name: 'Keyboard', category: 'Electronics', unit: 'unit', carbon: 5, alternatives: [{ name: 'Mechanical Keyboard', carbon: 6 }, { name: 'Wireless Keyboard', carbon: 7 }, { name: 'Eco Keyboard', carbon: 3 }] },
  { name: 'Mouse', category: 'Electronics', unit: 'unit', carbon: 3, alternatives: [{ name: 'Trackball', carbon: 2 }, { name: 'Wireless Mouse', carbon: 4 }, { name: 'Touchpad', carbon: 0.5 }] },
  { name: 'Headphones', category: 'Electronics', unit: 'unit', carbon: 10, alternatives: [{ name: 'Earbuds', carbon: 5 }, { name: 'Wired Headphones', carbon: 8 }, { name: 'Bone Conduction', carbon: 6 }] },
  { name: 'Speakers', category: 'Electronics', unit: 'unit', carbon: 15, alternatives: [{ name: 'Soundbar', carbon: 12 }, { name: 'Portable Speaker', carbon: 8 }, { name: 'Eco Speaker', carbon: 7 }] },
  { name: 'Printer', category: 'Electronics', unit: 'unit', carbon: 40, alternatives: [{ name: 'Digital Documents', carbon: 0 }, { name: 'Laser Printer', carbon: 35 }, { name: 'Inkjet Printer', carbon: 25 }] },

  // ===================== Transport =====================
  { name: 'Electric Car (per km)', category: 'Transport', unit: 'km', carbon: 0.08, alternatives: [{ name: 'Hybrid Car', carbon: 0.12 }, { name: 'Bus', carbon: 0.08 }, { name: 'Bicycle', carbon: 0 }] },
  { name: 'Petrol Car (per km)', category: 'Transport', unit: 'km', carbon: 0.192, alternatives: [{ name: 'Hybrid Car', carbon: 0.12 }, { name: 'Electric Car', carbon: 0.08 }, { name: 'Public Transport', carbon: 0.05 }] },
  { name: 'Diesel Car (per km)', category: 'Transport', unit: 'km', carbon: 0.171, alternatives: [{ name: 'Electric Car', carbon: 0.08 }, { name: 'Bus', carbon: 0.08 }, { name: 'Walking', carbon: 0 }] },
  { name: 'Bus (per km)', category: 'Transport', unit: 'km', carbon: 0.08, alternatives: [{ name: 'Train', carbon: 0.041 }, { name: 'Carpool', carbon: 0.05 }, { name: 'Bicycle', carbon: 0 }] },
  { name: 'Train (per km)', category: 'Transport', unit: 'km', carbon: 0.041, alternatives: [{ name: 'Bus', carbon: 0.08 }, { name: 'Carpool', carbon: 0.05 }, { name: 'Walking', carbon: 0 }] },
  { name: 'Metro/Subway (per km)', category: 'Transport', unit: 'km', carbon: 0.05, alternatives: [{ name: 'Walking', carbon: 0 }, { name: 'Bicycle', carbon: 0 }, { name: 'Bus', carbon: 0.08 }] },
  { name: 'Bicycle (per km)', category: 'Transport', unit: 'km', carbon: 0, alternatives: [{ name: 'Walking', carbon: 0 }, { name: 'Public Transport', carbon: 0.05 }, { name: 'Electric Scooter', carbon: 0.02 }] },
  { name: 'Walking (per km)', category: 'Transport', unit: 'km', carbon: 0, alternatives: [{ name: 'Bicycle', carbon: 0 }, { name: 'Metro', carbon: 0.05 }, { name: 'Electric Scooter', carbon: 0.02 }] },
  { name: 'Motorbike (per km)', category: 'Transport', unit: 'km', carbon: 0.08, alternatives: [{ name: 'Bicycle', carbon: 0 }, { name: 'Electric Scooter', carbon: 0.02 }, { name: 'Carpool', carbon: 0.05 }] },
  { name: 'Taxi (per km)', category: 'Transport', unit: 'km', carbon: 0.2, alternatives: [{ name: 'Uber Pool', carbon: 0.12 }, { name: 'Bus', carbon: 0.08 }, { name: 'Metro', carbon: 0.05 }] },

  // ---------------- Missing Data ----------------
  { name: "Glass Bottle (500ml)", category: "Consumable", unit: "bottle", carbon: 0.05, alternatives: [{ name: "Reusable Glass Bottle (1L)", carbon: 0.02 }, { name: "Stainless Steel Bottle", carbon: 0.03 }, { name: "Ceramic Bottle", carbon: 0.01 }] },
  { name: "Plastic Water Bottle (500ml)", category: "Consumable", unit: "bottle", carbon: 0.1, alternatives: [{ name: "Reusable Steel Bottle", carbon: 0.03 }, { name: "Reusable Glass Bottle", carbon: 0.02 }, { name: "Filtered Tap Water Bottle", carbon: 0.01 }] },
  { name: "Reusable Water Bottle (steel)", category: "Kitchen", unit: "bottle", carbon: 3, alternatives: [{ name: "Aluminum Bottle", carbon: 2.5 }, { name: "Glass Bottle with Sleeve", carbon: 2.2 }, { name: "BPA-free Plastic Bottle", carbon: 2.8 }] },
  { name: "Car (electric) per km", category: "Transport", unit: "km", carbon: 0.08, alternatives: [{ name: "Public Bus per km", carbon: 0.03 }, { name: "Train per km", carbon: 0.02 }, { name: "Bicycle", carbon: 0 }] },
  { name: "Cardboard Box (small)", category: "Shipping", unit: "box", carbon: 0.5, alternatives: [{ name: "Recycled Cardboard Box", carbon: 0.2 }, { name: "Reusable Plastic Crate", carbon: 0.1 }, { name: "Biodegradable Packaging", carbon: 0.05 }] }

];

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding');

    for (const it of items) {
      const exists = await Item.findOne({ name: it.name });
      if (exists) {
        await Item.updateOne({ _id: exists._id }, { $set: it });
      } else {
        await Item.create(it);
      }
    }

    const count = await Item.countDocuments();
    console.log(`Seed complete. Items in DB: ${count}`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
