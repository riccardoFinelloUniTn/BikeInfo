import mongoose, { Schema, Document } from "mongoose";

interface Review extends Document {
  entityId: string;
  rating: number;
  uEmail: string;
  uName: string;
  comment: string;
  date: Date;
}

const reviewSchema: Schema = new Schema({
  entityId: { type: String, required: true },
  rating: { type: Number, required: true },
  uEmail: { type: String, required: true },
  uName: {type: String, required: true},
  comment: { type: String, required: true },
  date: { type: Date, required: true },
});

const reviewModel = mongoose.model<Review>("Review", reviewSchema);
export default reviewModel;
