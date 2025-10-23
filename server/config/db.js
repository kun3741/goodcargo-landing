import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/goodcargo-reach';
    await mongoose.connect(mongoURI);
    console.log('MongoDB підключено успішно');
  } catch (error) {
    console.error('Помилка підключення до MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;

