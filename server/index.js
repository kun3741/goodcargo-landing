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

// Завантаження .env файлу (для локальної розробки)
// На Render ENV змінні встановлюються через платформу
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Логування ENV змінних для діагностики (без секретів)
console.log('=== Server Configuration ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', PORT);
console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
console.log('ADMIN_PASSWORD exists:', !!process.env.ADMIN_PASSWORD);
console.log('===========================');

// CORS налаштування
const corsOptions = {
  origin: function (origin, callback) {
    // На Render в production фронтенд і бекенд на одному домені
    // Дозволяємо запити без origin або з того ж домену
    if (!origin) return callback(null, true);
    
    // В режимі розробки дозволяємо localhost origins
    if (process.env.NODE_ENV !== 'production') {
      if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
        return callback(null, true);
      }
    }
    
    // В продакшені дозволяємо всі (оскільки на Render це один сервіс)
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Preflight запити для всіх маршрутів
app.options('*', cors(corsOptions));

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

