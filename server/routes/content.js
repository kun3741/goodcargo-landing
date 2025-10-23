import express from 'express';
import Content from '../models/Content.js';

const router = express.Router();

// Отримати весь контент
router.get('/', async (req, res) => {
  try {
    let content = await Content.findOne();
    
    // Якщо контенту немає, створюємо за замовчуванням
    if (!content) {
      content = new Content({});
      await content.save();
    }
    
    res.json(content);
  } catch (error) {
    console.error('Помилка отримання контенту:', error);
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

// Оновити контент
router.put('/', async (req, res) => {
  try {
    let content = await Content.findOne();
    
    if (!content) {
      content = new Content(req.body);
    } else {
      // Оновлюємо всі поля
      Object.assign(content, req.body);
    }
    
    await content.save();
    res.json({ message: 'Контент успішно оновлено', content });
  } catch (error) {
    console.error('Помилка оновлення контенту:', error);
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

export default router;

