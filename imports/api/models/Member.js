import mongoose, { Schema } from 'mongoose';

const memberSchema = new Schema({
  nome_completo: String,
  nomeEmCitacoesBibliograficas: String,
  id_lattes: String,
});

export default mongoose.model('members', memberSchema);
