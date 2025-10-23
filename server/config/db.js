import mongoose from 'mongoose';

const connectDB = async (retries = 5, delay = 5000) => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/goodcargo-reach';
  
  console.log('Спроба підключення до MongoDB...');
  console.log('MongoDB URI встановлено:', mongoURI ? 'Так' : 'Ні');
  
  for (let i = 0; i < retries; i++) {
    try {
      await mongoose.connect(mongoURI, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
      console.log('MongoDB підключено успішно');
      
      // Обробка помилок підключення після успішного підключення
      mongoose.connection.on('error', (err) => {
        console.error('Помилка MongoDB:', err);
      });
      
      mongoose.connection.on('disconnected', () => {
        console.log('MongoDB відключено. Спроба перепідключення...');
        setTimeout(() => connectDB(3, 3000), 1000);
      });
      
      return;
    } catch (error) {
      console.error(`Спроба ${i + 1}/${retries} підключення до MongoDB провалилась:`, error.message);
      
      if (i === retries - 1) {
        console.error('Не вдалось підключитись до MongoDB після всіх спроб');
        // Не виходимо з процесу, дозволяємо серверу працювати
        return;
      }
      
      console.log(`Очікування ${delay / 1000} секунд перед наступною спробою...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

export default connectDB;

