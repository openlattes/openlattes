import mongoose, { Schema } from 'mongoose';

const memberSchema = new Schema({
  fullName: String,
  citationName: String,
  unity: String,
  academicDegree: String,
  lattesId: String,
  cvLastUpdate: Date,
  researchGroups: [String],
  coauthors: [Schema.Types.ObjectId],
  areas: [{
    bigArea: String,
    area: String,
    subArea: String,
    specialization: String,
  }],
});

export default mongoose.model('members', memberSchema);
