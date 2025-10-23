import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import heroBackground from '@/assets/hero-background.jpg';
import testimonial1 from '@/assets/testimonial-1.jpg';
import testimonial2 from '@/assets/testimonial-2.jpg';
import advantagesBackground from '@/assets/advantages-background.jpg';

export interface HeroContent {
  title: string;
  description: string;
  buttonText: string;
  buttonVisible: boolean;
  backgroundImage: string;
}

export interface Testimonial {
  id: string;
  photo: string;
  title: string;
  description: string;
}

export interface Advantage {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface Document {
  id: string;
  title: string;
  fileUrl: string;
}

export interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  telegram: string;
  facebook: string;
  instagram: string;
}

export interface AdvantagesSection {
  title: string;
  description: string;
  backgroundImage: string;
  items: Advantage[];
}

export interface Content {
  hero: HeroContent;
  testimonials: {
    title: string;
    items: Testimonial[];
  };
  advantages: AdvantagesSection;
  documents: {
    title: string;
    items: Document[];
  };
  contact: ContactInfo;
  telegram: {
    botToken: string;
    chatId: string;
  };
}

const defaultContent: Content = {
  hero: {
    title: 'Допоможіть нам доставити допомогу туди, де вона потрібна',
    description: 'Приєднуйтесь до команди волонтерів "Добрий Вантаж" та зробіть свій внесок у перемогу',
    buttonText: 'Стати волонтером',
    buttonVisible: true,
    backgroundImage: heroBackground,
  },
  testimonials: {
    title: 'Відгуки волонтерів',
    items: [
      {
        id: '1',
        photo: testimonial1,
        title: 'Марія Коваленко',
        description: 'Волонтерство в "Добрий Вантаж" змінило моє життя. Відчуття, що ти допомагаєш людям у скрутний час - неймовірне.',
      },
      {
        id: '2',
        photo: testimonial2,
        title: 'Андрій Петренко',
        description: 'Професійна команда та чітка організація роботи. Кожен може знайти своє місце та приносити користь.',
      },
      {
        id: '3',
        photo: testimonial1,
        title: 'Олена Шевченко',
        description: 'Приєдналася до команди рік тому і не шкодую. Тут я знайшла справжніх друзів та можливість реально допомагати.',
      },
      {
        id: '4',
        photo: testimonial2,
        title: 'Віктор Мельник',
        description: 'Дякую за можливість бути частиною чогось важливого. Кожна доставка - це маленька перемога на шляху до великої.',
      },
      {
        id: '5',
        photo: testimonial1,
        title: 'Ірина Бондаренко',
        description: 'Найкраща волонтерська організація, з якою я працювала. Всі процеси налагоджені, є підтримка і зворотній зв\'язок.',
      },
      {
        id: '6',
        photo: testimonial2,
        title: 'Олександр Ткаченко',
        description: 'Починав як звичайний волонтер, зараз координую логістику. Тут цінують кожного і дають можливість розвиватися.',
      },
      {
        id: '7',
        photo: testimonial1,
        title: 'Наталія Савченко',
        description: 'Вражена рівнем організації та професіоналізму. Кожна гривня та кожна година витрачаються максимально ефективно.',
      },
      {
        id: '8',
        photo: testimonial2,
        title: 'Дмитро Сидоренко',
        description: 'Волонтерство - це не тільки про допомогу іншим, але й про особисте зростання. "Добрий Вантаж" дав мені обидва.',
      },
    ],
  },
  advantages: {
    title: 'Чому варто приєднатися до нас',
    description: 'Ми створили умови для ефективної волонтерської діяльності',
    backgroundImage: advantagesBackground,
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

export const useContentManagement = () => {
  const [content, setContent] = useState<Content>(defaultContent);
  const [loading, setLoading] = useState(true);

  // Завантаження контенту з API
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await api.getContent();
        // Видаляємо _id та __v поля MongoDB
        const { _id, __v, createdAt, updatedAt, ...cleanContent } = data;
        setContent(cleanContent);
      } catch (error) {
        console.error('Помилка завантаження контенту:', error);
        // Використовуємо defaultContent якщо не вдалося завантажити
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const updateContent = async (newContent: Content) => {
    try {
      await api.updateContent(newContent);
      setContent(newContent);
      return { success: true };
    } catch (error) {
      console.error('Помилка оновлення контенту:', error);
      return { success: false, error };
    }
  };

  return { content, updateContent, loading };
};
