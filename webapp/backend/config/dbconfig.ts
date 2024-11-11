// config/dbconfig.ts
import mongoose from 'mongoose';

const mongoURI = 'mongodb+srv://riccardofinello:0PgsKP2ACrYJsVSz@infobikecluster.dilv1.mongodb.net/'; 

mongoose.connect(mongoURI)
  .then(() => console.log('Mongoose is connected'))
  .catch((err) => console.error('Mongoose connection error:', err));

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose is disconnected');
});

export default mongoose;
