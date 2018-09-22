import mongoose from 'mongoose';

const { Schema } = mongoose;

const coAuthorshipSchema = new Schema({
  members: [Schema.Types.ObjectId],
  productions: [Schema.Types.ObjectId],
});

export default mongoose.model('coauthorships', coAuthorshipSchema);
