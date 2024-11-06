import mongoose, { Document, Schema } from 'mongoose';

// Define the User interface for TypeScript
interface IUser extends Document {
  uid: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  picture?: string;
}

const userSchema: Schema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  surname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  picture: { type: String }
});

// Export the model with IUser type
export default mongoose.model<IUser>('User', userSchema);
