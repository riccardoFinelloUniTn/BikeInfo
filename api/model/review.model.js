const reviewSchema = new mongoose.Schema({
    rid: { type: String, required: true, unique: true },
    entityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Entity', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    uEmail: { type: String, required: true },
    comment: { type: String },
    date: { type: Date, required: true }
  });
  
  module.exports = mongoose.model('Review', reviewSchema);
  