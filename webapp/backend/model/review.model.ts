import mongoose, { Document, Schema } from 'mongoose';

// Define the Review interface for TypeScript
interface IReview extends Document {
  rid: string;
  entityId: mongoose.Types.ObjectId; // Reference to Entity model
  rating: number;
  uEmail: string;
  comment: string;
  date: Date;
}

const reviewSchema: Schema = new mongoose.Schema({
  rid: { type: String, required: true, unique: true },
  entityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Entity', required: true },
  rating: { type: Number, required: true },
  uEmail: { type: String, required: true },
  comment: { type: String, required: true },
  date: { type: Date, required: true }
});

// Export the Review model with IReview type
export default mongoose.model<IReview>('Review', reviewSchema);
