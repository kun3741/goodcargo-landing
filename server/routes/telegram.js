import express from 'express';

const router = express.Router();

// Відправити заявку в Telegram
router.post('/send-application', async (req, res) => {
  try {
    const { name, phone, email } = req.body;
    
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    
    if (!botToken || !chatId) {
      return res.status(503).json({ 
        success: false,
        message: 'Telegram не налаштований. Зверніться до адміністратора.' 
      });
    }

    if (!name || !phone || !email) {
      return res.status(400).json({
        success: false,
        message: 'Всі поля обов\'язкові'
      });
    }

    const nameTrimmed = String(name).trim();
    const emailTrimmed = String(email).trim();
    const phoneTrimmed = String(phone).trim();

    const nameRegex = /^[A-Za-zА-Яа-яЁёІіЇїЄєҐґ' -]{2,}$/u;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const uaPhoneRegex = /^\+380\d{9}$/;

    if (!nameRegex.test(nameTrimmed)) {
      return res.status(400).json({ success: false, message: "Невалідне ім'я" });
    }
    if (!emailRegex.test(emailTrimmed)) {
      return res.status(400).json({ success: false, message: 'Невалідний email' });
    }
    if (!uaPhoneRegex.test(phoneTrimmed)) {
      return res.status(400).json({ success: false, message: 'Телефон у форматі +380XXXXXXXXX' });
    }

    const message = `🆕 Нова заявка!\n\n👤 Ім'я: ${nameTrimmed}\n📱 Телефон: ${phoneTrimmed}\n📧 Email: ${emailTrimmed}`;

    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    if (response.ok) {
      res.json({ 
        success: true,
        message: 'Заявку успішно надіслано' 
      });
    } else {
      const error = await response.json();
      console.error('Telegram API error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Помилка відправки. Спробуйте пізніше.' 
      });
    }
  } catch (error) {
    console.error('Error sending telegram message:', error);
    res.status(500).json({ 
      success: false,
      message: 'Помилка сервера' 
    });
  }
});

export default router;

