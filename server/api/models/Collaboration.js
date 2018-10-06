import mongoose from 'mongoose';

const { Schema } = mongoose;

const collaborationSchema = new Schema({
  members: [Schema.Types.ObjectId],
  productions: [Schema.Types.ObjectId],
  supervisions: [Schema.Types.ObjectId],
});

export default mongoose.model('collaborations', collaborationSchema);
