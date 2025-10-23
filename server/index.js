import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import contentRoutes from './routes/content.js';
import authRoutes from './routes/auth.js';
import telegramRoutes from './routes/telegram.js';
import { authMiddleware } from './middleware/auth.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// API Routes
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/telegram', telegramRoutes);

// Захищені роути для оновлення контенту
app.put('/api/content', authMiddleware, contentRoutes);

// Serve static files from frontend build (production)
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../dist');
  app.use(express.static(frontendPath));
  
  // Всі інші маршрути відправляємо до React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

// Запуск сервера
const server = app.listen(PORT, () => {
  console.log(`Сервер запущено на порті ${PORT}`);
  console.log(`Режим: ${process.env.NODE_ENV || 'development'}`);
});

// Підключення до БД (асинхронно, не блокуємо запуск сервера)
connectDB().catch(err => {
  console.error('Критична помилка підключення до БД:', err);
});

// Graceful shutdown
const gracefulShutdown = (signal) => {
  console.log(`\n${signal} отримано. Закриття сервера...`);
  server.close(() => {
    console.log('HTTP сервер закрито');
    mongoose.connection.close(false, () => {
      console.log('MongoDB з\'єднання закрито');
      process.exit(0);
    });
  });

  // Примусове закриття після 10 секунд
  setTimeout(() => {
    console.error('Не вдалося закрити з\'єднання вчасно, примусовий вихід');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Обробка неперехоплених помилок
process.on('unhandledRejection', (err) => {
  console.error('Неперехоплена Promise rejection:', err);
});

process.on('uncaughtException', (err) => {
  console.error('Неперехоплений виняток:', err);
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

