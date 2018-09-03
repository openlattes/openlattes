import mongoose, { Schema } from 'mongoose';

const memberSchema = new Schema({
  nome_completo: String,
  nomeEmCitacoesBibliograficas: String,
  unidade: String,
  titulacao: String,
  id_lattes: String,
  atualizacao: Date,
  gruposDePesquisa: [String],
  colaboradores: [Schema.Types.ObjectId],
  areasDeAtuacao: [{
    grandeArea: String,
    area: String,
    subArea: String,
    especializacao: String,
  }],
});

export default mongoose.model('members', memberSchema);
