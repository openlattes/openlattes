import mongoose from 'mongoose';

const { Schema } = mongoose;

const memberSchema = new Schema({
  fullName: String,
  citationName: String,
  unity: String,
  group: String,
  groups: [String],
  academicDegrees: [String],
  summary: String,
  lattesId: String,
  cvLastUpdate: Date,
  researchGroups: [String],
  collaborators: [Schema.Types.ObjectId],
  areas: [{
    bigArea: String,
    area: String,
    subArea: String,
    specialization: String,
  }],
});

export default mongoose.model('members', memberSchema);
