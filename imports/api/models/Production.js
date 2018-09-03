import mongoose, { Schema } from 'mongoose';

const productionSchema = new Schema({
  titulo: String,
  ano: Number,
  autores: String,
  categoria: String,
  type: String,
  doi: String,
  issn: String,
  paginas: String,
  revista: String,
  volume: String,
  members: [Schema.Types.ObjectId],
});

export default mongoose.model('productions', productionSchema);
