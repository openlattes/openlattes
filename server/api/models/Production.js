import mongoose from 'mongoose';

const { Schema } = mongoose;

const productionSchema = new Schema({
  title: String,
  year: Number,
  authors: String,
  category: String,
  type: String,
  doi: String,
  issn: String,
  pages: String,
  magazine: String,
  volume: String,
  edition: String,
  editor: String,
  institution: String,
  name: String,
  eventName: String,
  newspaperName: String,
  supervisionType: String,
  members: [Schema.Types.ObjectId],
});

export default mongoose.model('productions', productionSchema);
