import mongoose, { Document, Schema } from 'mongoose';

// Define the Entity interface for TypeScript
export interface IEntity extends Document {  // Add "export" here
  eid: string;
  name: string;
  description: string;
  geolocation: string;
  type: [[number]];
  rating: number;
  reviews: number;
}

const entitySchema: Schema = new mongoose.Schema({
  eid: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  geolocation: { type: [[Number]], required: true },
  type: { type: String, required: true },
  rating: { type: Number, required: true },
  reviews: { type: Number, required: true},
});

// Export the Entity model with IEntity type
export default mongoose.model<IEntity>('Entity', entitySchema);
