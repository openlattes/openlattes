import mongoose, { Schema } from 'mongoose';

const productionSchema = new Schema({
  titulo: String,
  ano: Number,
  autores: String,
  revista: String,
  volume: String,
  type: String,
  members: [Schema.Types.ObjectId],
});

export default mongoose.model('productions', productionSchema);
