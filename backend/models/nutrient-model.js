import mongoose, { Schema, model } from 'mongoose';

const nutrientSchema = new Schema({
  abbreviation: {type: String, required: true},
  name: {type: String, required: true},
  unit: {type: String, required: true},
  description: {type: String, default: ''},
  group: { type: String, default: '' },  // Energy, Composition, Minerals, Amino acids
  source: { type: String, required: true }, // global or user
});

export default model('Nutrient', nutrientSchema);