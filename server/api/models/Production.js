import mongoose from 'mongoose';

const { Schema } = mongoose;

const productionSchema = new Schema({
  title: String,
  year: Number,
  authors: String,
  category: String,
  type: String,
  nature: String,
  doi: String,
  issn: String,
  pages: String,
  book: String,
  magazine: String,
  volume: String,
  edition: String,
  editor: String,
  eventName: String,
  newspaperName: String,
  date: Date,
  number: Number,
  members: [Schema.Types.ObjectId],
});

export default mongoose.model('productions', productionSchema);
