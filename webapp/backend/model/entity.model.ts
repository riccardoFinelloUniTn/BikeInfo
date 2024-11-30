import mongoose, { Document, Schema } from 'mongoose';

// Define the Entity interface for TypeScript
export interface IEntity extends Document {  // Add "export" here
  eid: string;
  name: string;
  description: string;
  geolocation: string;
  type: string;
  rating: number;
  reviews: mongoose.Types.ObjectId[]; // References to Review model
  feedbacks: mongoose.Types.ObjectId[]; // References to Feedback model
}

const entitySchema: Schema = new mongoose.Schema({
  eid: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  geolocation: { type: String, required: true },
  type: { type: String, required: true },
  rating: { type: Number, required: true },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  feedbacks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Feedback' }],
});

// Export the Entity model with IEntity type
export default mongoose.model<IEntity>('Entity', entitySchema);
