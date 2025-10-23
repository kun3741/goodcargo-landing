import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Content from './models/Content.js';

dotenv.config();

const defaultContent = {
  hero: {
    title: 'Допоможіть нам доставити допомогу туди, де вона потрібна',
    description: 'Приєднуйтесь до команди волонтерів "Добрий Вантаж" та зробіть свій внесок у перемогу',
    buttonText: 'Стати волонтером',
    buttonVisible: true,
    backgroundImage: '/src/assets/hero-background.jpg',
  },
  testimonials: {
    title: 'Відгуки волонтерів',
    items: [
      {
        id: '1',
        photo: '/src/assets/testimonial-1.jpg',
        title: 'Марія Коваленко',
        description: 'Волонтерство в "Добрий Вантаж" змінило моє життя. Відчуття, що ти допомагаєш людям у скрутний час - неймовірне.',
      },
      {
        id: '2',
        photo: '/src/assets/testimonial-2.jpg',
        title: 'Андрій Петренко',
        description: 'Професійна команда та чітка організація роботи. Кожен може знайти своє місце та приносити користь.',
      },
      {
        id: '3',
        photo: '/src/assets/testimonial-1.jpg',
        title: 'Олена Шевченко',
        description: 'Приєдналася до команди рік тому і не шкодую. Тут я знайшла справжніх друзів та можливість реально допомагати.',
      },
      {
        id: '4',
        photo: '/src/assets/testimonial-2.jpg',
        title: 'Віктор Мельник',
        description: 'Дякую за можливість бути частиною чогось важливого. Кожна доставка - це маленька перемога на шляху до великої.',
      },
      {
        id: '5',
        photo: '/src/assets/testimonial-1.jpg',
        title: 'Ірина Бондаренко',
        description: 'Найкраща волонтерська організація, з якою я працювала. Всі процеси налагоджені, є підтримка і зворотній зв\'язок.',
      },
      {
        id: '6',
        photo: '/src/assets/testimonial-2.jpg',
        title: 'Олександр Ткаченко',
        description: 'Починав як звичайний волонтер, зараз координую логістику. Тут цінують кожного і дають можливість розвиватися.',
      },
      {
        id: '7',
        photo: '/src/assets/testimonial-1.jpg',
        title: 'Наталія Савченко',
        description: 'Вражена рівнем організації та професіоналізму. Кожна гривня та кожна година витрачаються максимально ефективно.',
      },
      {
        id: '8',
        photo: '/src/assets/testimonial-2.jpg',
        title: 'Дмитро Сидоренко',
        description: 'Волонтерство - це не тільки про допомогу іншим, але й про особисте зростання. "Добрий Вантаж" дав мені обидва.',
      },
    ],
  },
  advantages: {
    title: 'Чому варто приєднатися до нас',
    description: 'Ми створили умови для ефективної волонтерської діяльності',
    backgroundImage: '/src/assets/advantages-background.jpg',
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
    botToken: 'Налаштовується через ENV',
    chatId: 'Налаштовується через ENV',
  },
};

const seedDatabase = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/goodcargo-reach';
    await mongoose.connect(mongoURI);
    console.log('Підключено до MongoDB');

    // Видаляємо існуючий контент
    await Content.deleteMany({});
    console.log('Старий контент видалено');

    // Додаємо новий контент
    const content = new Content(defaultContent);
    await content.save();
    console.log('Новий контент додано успішно!');

    process.exit(0);
  } catch (error) {
    console.error('Помилка при заповненні бази даних:', error);
    process.exit(1);
  }
};

seedDatabase();

