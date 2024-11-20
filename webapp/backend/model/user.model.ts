import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
  uid: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  salt: string;
  role: string;
}

const userSchema = new Schema<IUser>({
  uid: { type: String, required: true },
  name: { type: String, required: true },
  surname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  salt: { type: String, required: true },
  role: { type: String, required: true}
});

const User = mongoose.model<IUser>('User', userSchema);
export default User;
