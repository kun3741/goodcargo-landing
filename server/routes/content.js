import express from 'express';
import Content from '../models/Content.js';

const router = express.Router();

// Дефолтний контент
// ВАЖЛИВО: Шляхи до картинок повинні збігатися з іменами файлів у папці dist/assets
// після білду (без хешів, завдяки налаштуванням у vite.config.ts)
const defaultContent = {
  hero: {
    title: 'Допоможіть нам доставити допомогу туди, де вона потрібна',
    description: 'Приєднуйтесь до команди волонтерів "Добрий Вантаж" та зробіть свій внесок у перемогу',
    buttonText: 'Стати волонтером',
    buttonVisible: true,
    backgroundImage: '/assets/hero-background.jpg',
  },
  testimonials: {
    title: 'Відгуки волонтерів',
    items: [
      {
        id: '1',
        photo: '/assets/testimonial-1.jpg',
        title: 'Марія Коваленко',
        description: 'Волонтерство в "Добрий Вантаж" змінило моє життя. Відчуття, що ти допомагаєш людям у скрутний час - неймовірне.',
      },
      {
        id: '2',
        photo: '/assets/testimonial-2.jpg',
        title: 'Андрій Петренко',
        description: 'Професійна команда та чітка організація роботи. Кожен може знайти своє місце та приносити користь.',
      },
      {
        id: '3',
        photo: '/assets/testimonial-1.jpg',
        title: 'Дмитро Сидоренко',
        description: 'Волонтерство - це не тільки про допомогу іншим, але й про особисте зростання. "Добрий Вантаж" дав мені обидва.',
      },
    ],
  },
  advantages: {
    title: 'Чому варто приєднатися до нас',
    description: 'Ми створили умови для ефективної волонтерської діяльності',
    backgroundImage: '/assets/advantages-background.jpg',
    items: [
      {
        id: '1',
        icon: 'Users',
        title: 'Велика спільнота',
        description: 'Понад 500 активних волонтерів по всій Україні',
      },
      {
        id: '2',
        icon: 'Shield',
        title: 'Прозорість',
        description: 'Звітуємо про кожну доставку та витрачені кошти',
      },
      {
        id: '3',
        icon: 'Heart',
        title: 'Підтримка',
        description: 'Надаємо навчання та супровід для нових волонтерів',
      },
      {
        id: '4',
        icon: 'Target',
        title: 'Ефективність',
        description: 'Доставили допомоги на суму понад 10 млн грн',
      },
    ],
  },
  documents: {
    title: 'Документи',
    items: [
      {
        id: '1',
        title: 'Статут організації',
        fileUrl: '#',
      },
      {
        id: '2',
        title: 'Звіт за 2024 рік',
        fileUrl: '#',
      },
    ],
  },
  contact: {
    address: 'м. Київ, вул. Хрещатик, 1',
    phone: '+380 44 123 4567',
    email: 'info@dobryivantazh.org',
    telegram: '@dobryivantazh',
    facebook: 'facebook.com/dobryivantazh',
    instagram: 'instagram.com/dobryivantazh',
  },
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN || '',
    chatId: process.env.TELEGRAM_CHAT_ID || '',
  },
};

// Отримати весь контент
router.get('/', async (req, res) => {
  try {
    let content = await Content.findOne();
    
    // Якщо контенту немає, створюємо за замовчуванням
    if (!content) {
      content = new Content(defaultContent);
      await content.save();
    }
    
    // Перевіряємо що всі необхідні поля існують
    const safeContent = {
      hero: content.hero || defaultContent.hero,
      testimonials: {
        title: content.testimonials?.title || defaultContent.testimonials.title,
        items: content.testimonials?.items || defaultContent.testimonials.items,
      },
      advantages: {
        title: content.advantages?.title || defaultContent.advantages.title,
        description: content.advantages?.description || defaultContent.advantages.description,
        backgroundImage: content.advantages?.backgroundImage || defaultContent.advantages.backgroundImage,
        items: content.advantages?.items || defaultContent.advantages.items,
      },
      documents: {
        title: content.documents?.title || defaultContent.documents.title,
        items: content.documents?.items || defaultContent.documents.items,
      },
      contact: content.contact || defaultContent.contact,
      telegram: content.telegram || defaultContent.telegram,
    };
    
    res.json(safeContent);
  } catch (error) {
    console.error('Помилка отримання контенту:', error);
    // Якщо помилка (наприклад, БД недоступна), повертаємо дефолтний контент
    res.json(defaultContent);
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

