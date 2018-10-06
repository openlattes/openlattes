import mongoose from 'mongoose';

const { Schema } = mongoose;

const supervisionSchema = new Schema({
  year: Number,
  completed: Boolean,
  degreeType: String,
  documentTitle: String,
  fundingAgency: String,
  institution: String,
  supervisedStudent: String,
  members: [Schema.Types.ObjectId],
});

export default mongoose.model('supervisions', supervisionSchema);
