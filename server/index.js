import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
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

// Підключення до БД
connectDB();

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
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

app.listen(PORT, () => {
  console.log(`Сервер запущено на порті ${PORT}`);
  console.log(`Режим: ${process.env.NODE_ENV || 'development'}`);
});

