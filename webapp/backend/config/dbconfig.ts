// config/dbconfig.ts
import mongoose from 'mongoose';

const mongoURI = 'mongodb://localhost:27017/yourDatabaseName';

mongoose.connect(mongoURI)
  .then(() => console.log('Mongoose is connected'))
  .catch((err) => console.error('Mongoose connection error:', err));

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose is disconnected');
});

export default mongoose;
