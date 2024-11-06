const feedbackSchema = new mongoose.Schema({
    fid: { type: String, required: true, unique: true },
    entityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Entity', required: true },
    uEmail: { type: String, required: true },
    comment: { type: String },
    geolocation: { type: String },
    date: { type: Date, required: true }
  });
  
  module.exports = mongoose.model('Feedback', feedbackSchema);
  