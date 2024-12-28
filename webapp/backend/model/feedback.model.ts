// models/feedback.model.ts
import mongoose, { Document, Schema } from 'mongoose';
import Response from 'express';

// Define the Feedback interface for TypeScript
interface IFeedback extends Document {
  fid: string;
  entityId: mongoose.Types.ObjectId; // Reference to Entity model
  uEmail: string;
  comment: string;
  answer: string;
  geolocation: string;
  date: Date;
}

const feedbackSchema: Schema = new mongoose.Schema({
  fid: { type: String, required: true, unique: true },
  entityId: { type: String, required: true },
  uEmail: { type: String, required: true },
  comment: { type: String, required: true },
  answer: {type: String, required: false},
  geolocation: { type: String, required: true },
  date: { type: Date, required: true }
});

// Export the Feedback model with IFeedback type
export default mongoose.model<IFeedback>('Feedback', feedbackSchema);
