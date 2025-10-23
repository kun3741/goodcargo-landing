import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Логін адміністратора
router.post('/login', async (req, res) => {
  try {
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    if (password === adminPassword) {
      const token = jwt.sign(
        { role: 'admin' },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );
      
      res.json({ 
        success: true,
        token,
        message: 'Успішний вхід' 
      });
    } else {
      res.status(401).json({ 
        success: false,
        message: 'Невірний пароль' 
      });
    }
  } catch (error) {
    console.error('Помилка авторизації:', error);
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

// Перевірка токена
router.get('/verify', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ valid: false });
    }
    
    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    res.json({ valid: true });
  } catch (error) {
    res.status(401).json({ valid: false });
  }
});

export default router;

